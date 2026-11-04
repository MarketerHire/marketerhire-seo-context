"""
Graph Metrics Library for SEO Article Generator

Calculates PageRank, centrality metrics, and community detection
from InfraNodus knowledge graph outputs.
"""

import networkx as nx
from typing import Dict, List, Set, Any, Tuple
import json

try:
    import community.community_louvain as community_louvain
except ImportError:
    community_louvain = None


def build_graph_from_infranodus(infranodus_data: Dict[str, Any]) -> nx.Graph:
    """
    Build a NetworkX graph from InfraNodus API response.
    
    Args:
        infranodus_data: Response from InfraNodus MCP tools containing
                        nodes and edges (if addNodesAndEdges=True was set)
    
    Returns:
        NetworkX Graph object
    """
    G = nx.Graph()
    
    # Handle different InfraNodus response formats
    nodes = infranodus_data.get('nodes', infranodus_data.get('graph', {}).get('nodes', []))
    edges = infranodus_data.get('edges', infranodus_data.get('graph', {}).get('edges', []))
    
    # Add nodes with attributes
    for node in nodes:
        if isinstance(node, dict):
            node_id = node.get('id', node.get('name', str(node)))
            G.add_node(node_id, **{k: v for k, v in node.items() if k != 'id'})
        else:
            G.add_node(str(node))
    
    # Add edges with weights
    for edge in edges:
        if isinstance(edge, dict):
            source = edge.get('source', edge.get('from'))
            target = edge.get('target', edge.get('to'))
            weight = edge.get('weight', 1.0)
            if source and target:
                G.add_edge(source, target, weight=weight)
        elif isinstance(edge, (list, tuple)) and len(edge) >= 2:
            G.add_edge(edge[0], edge[1], weight=edge[2] if len(edge) > 2 else 1.0)
    
    return G


def calculate_pagerank(
    graph: nx.Graph,
    alpha: float = 0.85,
    max_iter: int = 100
) -> Dict[str, float]:
    """
    Calculate PageRank scores for all nodes.
    
    Higher PageRank = more informationally important entity.
    
    Args:
        graph: NetworkX Graph
        alpha: Damping factor (default 0.85)
        max_iter: Maximum iterations
    
    Returns:
        Dict mapping node IDs to PageRank scores
    """
    if len(graph.nodes()) == 0:
        return {}
    
    try:
        return nx.pagerank(graph, alpha=alpha, max_iter=max_iter)
    except nx.PowerIterationFailedConvergence:
        # Fallback with more iterations
        return nx.pagerank(graph, alpha=alpha, max_iter=max_iter * 2)


def calculate_centrality(graph: nx.Graph) -> Dict[str, Dict[str, float]]:
    """
    Calculate multiple centrality metrics for all nodes.
    
    Returns:
        Dict with keys: 'betweenness', 'eigenvector', 'degree', 'closeness'
        Each contains node_id -> score mapping
    """
    if len(graph.nodes()) == 0:
        return {
            'betweenness': {},
            'eigenvector': {},
            'degree': {},
            'closeness': {}
        }
    
    result = {}
    
    # Betweenness centrality - identifies bridge concepts
    result['betweenness'] = nx.betweenness_centrality(graph)
    
    # Degree centrality - basic connectivity
    result['degree'] = nx.degree_centrality(graph)
    
    # Closeness centrality - how quickly can reach other nodes
    try:
        result['closeness'] = nx.closeness_centrality(graph)
    except:
        result['closeness'] = {}
    
    # Eigenvector centrality - connected to other important nodes
    try:
        result['eigenvector'] = nx.eigenvector_centrality(
            graph, max_iter=1000, tol=1e-06
        )
    except (nx.PowerIterationFailedConvergence, nx.NetworkXException):
        # Fallback to degree-based approximation
        result['eigenvector'] = result['degree'].copy()
    
    return result


def detect_communities(graph: nx.Graph) -> List[Set[str]]:
    """
    Detect communities/clusters using Louvain algorithm.
    
    Returns:
        List of sets, each set containing node IDs in that community
    """
    if len(graph.nodes()) == 0:
        return []
    
    if community_louvain is None:
        # Fallback: use connected components as communities
        return [set(c) for c in nx.connected_components(graph)]
    
    # Louvain community detection
    partition = community_louvain.best_partition(graph)
    
    # Group nodes by community
    communities: Dict[int, Set[str]] = {}
    for node, comm_id in partition.items():
        if comm_id not in communities:
            communities[comm_id] = set()
        communities[comm_id].add(node)
    
    # Sort by size (largest first)
    return sorted(communities.values(), key=len, reverse=True)


def identify_hub_entities(
    graph: nx.Graph,
    top_n: int = 20,
    method: str = 'combined'
) -> List[Dict[str, Any]]:
    """
    Identify the most important entities (hub nodes) in the graph.
    
    Args:
        graph: NetworkX Graph
        top_n: Number of top entities to return
        method: 'pagerank', 'betweenness', 'eigenvector', or 'combined'
    
    Returns:
        List of dicts with 'entity', 'score', 'metrics' keys
    """
    if len(graph.nodes()) == 0:
        return []
    
    pagerank = calculate_pagerank(graph)
    centrality = calculate_centrality(graph)
    
    # Combine scores based on method
    if method == 'pagerank':
        scores = pagerank
    elif method == 'betweenness':
        scores = centrality['betweenness']
    elif method == 'eigenvector':
        scores = centrality['eigenvector']
    else:  # combined
        # Weighted combination
        scores = {}
        for node in graph.nodes():
            scores[node] = (
                pagerank.get(node, 0) * 0.4 +
                centrality['betweenness'].get(node, 0) * 0.3 +
                centrality['eigenvector'].get(node, 0) * 0.2 +
                centrality['degree'].get(node, 0) * 0.1
            )
    
    # Sort and get top N
    sorted_nodes = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
    
    return [
        {
            'entity': node,
            'score': score,
            'metrics': {
                'pagerank': pagerank.get(node, 0),
                'betweenness': centrality['betweenness'].get(node, 0),
                'eigenvector': centrality['eigenvector'].get(node, 0),
                'degree': centrality['degree'].get(node, 0)
            }
        }
        for node, score in sorted_nodes
    ]


def get_community_labels(
    communities: List[Set[str]],
    graph: nx.Graph,
    top_n: int = 3
) -> List[Dict[str, Any]]:
    """
    Generate labels for communities based on hub entities.
    
    Returns:
        List of dicts with 'id', 'size', 'hub_entities', 'label' keys
    """
    labeled_communities = []
    
    for i, community in enumerate(communities):
        # Create subgraph for this community
        subgraph = graph.subgraph(community)
        
        # Get top entities in this community
        hubs = identify_hub_entities(subgraph, top_n=top_n)
        hub_names = [h['entity'] for h in hubs]
        
        labeled_communities.append({
            'id': i,
            'size': len(community),
            'hub_entities': hub_names,
            'label': ' / '.join(hub_names[:2]) if hub_names else f'Cluster {i}',
            'members': list(community)
        })
    
    return labeled_communities


def export_metrics_report(
    graph: nx.Graph,
    include_full_metrics: bool = False
) -> Dict[str, Any]:
    """
    Generate a comprehensive metrics report for the semantic graph.
    
    Args:
        graph: NetworkX Graph
        include_full_metrics: Include all node metrics (can be large)
    
    Returns:
        Dict with graph statistics, hub entities, communities, etc.
    """
    if len(graph.nodes()) == 0:
        return {
            'status': 'empty_graph',
            'node_count': 0,
            'edge_count': 0
        }
    
    # Basic stats
    report = {
        'node_count': graph.number_of_nodes(),
        'edge_count': graph.number_of_edges(),
        'density': nx.density(graph),
        'is_connected': nx.is_connected(graph) if len(graph) > 0 else False
    }
    
    # Connected components
    components = list(nx.connected_components(graph))
    report['connected_components'] = len(components)
    report['largest_component_size'] = max(len(c) for c in components) if components else 0
    
    # Hub entities
    report['hub_entities'] = identify_hub_entities(graph, top_n=20)
    
    # Communities
    communities = detect_communities(graph)
    report['community_count'] = len(communities)
    report['communities'] = get_community_labels(communities, graph, top_n=3)
    
    # Degree distribution summary
    degrees = [d for n, d in graph.degree()]
    if degrees:
        report['degree_stats'] = {
            'min': min(degrees),
            'max': max(degrees),
            'mean': sum(degrees) / len(degrees),
            'median': sorted(degrees)[len(degrees) // 2]
        }
    
    # Full metrics if requested
    if include_full_metrics:
        pagerank = calculate_pagerank(graph)
        centrality = calculate_centrality(graph)
        report['all_metrics'] = {
            node: {
                'pagerank': pagerank.get(node, 0),
                **{k: v.get(node, 0) for k, v in centrality.items()}
            }
            for node in graph.nodes()
        }
    
    return report


def graph_to_json(graph: nx.Graph) -> Dict[str, Any]:
    """
    Convert NetworkX graph to JSON-serializable format.
    """
    return {
        'nodes': [
            {'id': node, **graph.nodes[node]}
            for node in graph.nodes()
        ],
        'edges': [
            {'source': u, 'target': v, **data}
            for u, v, data in graph.edges(data=True)
        ]
    }


# Convenience function for direct use with InfraNodus response
def analyze_infranodus_graph(
    infranodus_response: Dict[str, Any],
    top_entities: int = 20,
    include_full_metrics: bool = False
) -> Dict[str, Any]:
    """
    One-stop function to analyze an InfraNodus graph response.
    
    Args:
        infranodus_response: Response from InfraNodus MCP
        top_entities: Number of hub entities to identify
        include_full_metrics: Include per-node metrics
    
    Returns:
        Complete analysis report
    """
    graph = build_graph_from_infranodus(infranodus_response)
    report = export_metrics_report(graph, include_full_metrics=include_full_metrics)
    report['hub_entities'] = identify_hub_entities(graph, top_n=top_entities)
    return report






