"""
Corpus Processor Library for SEO Article Generator

Handles deduplication, categorization, and processing of research corpus
gathered from web searches.
"""

from typing import Dict, List, Any, Set, Tuple, Optional
import re
import hashlib
from collections import defaultdict

try:
    from rapidfuzz import fuzz
    FUZZY_AVAILABLE = True
except ImportError:
    FUZZY_AVAILABLE = False


def normalize_text(text: str) -> str:
    """
    Normalize text for comparison (lowercase, strip, collapse whitespace).
    """
    text = text.lower().strip()
    text = re.sub(r'\s+', ' ', text)
    return text


def get_text_hash(text: str) -> str:
    """
    Generate a hash for text content.
    """
    normalized = normalize_text(text)
    return hashlib.md5(normalized.encode()).hexdigest()[:16]


def deduplicate_content(
    corpus: List[str],
    similarity_threshold: float = 0.85,
    use_fuzzy: bool = True
) -> List[str]:
    """
    Remove duplicate and near-duplicate content from corpus.
    
    Args:
        corpus: List of text strings
        similarity_threshold: Threshold for fuzzy matching (0.0-1.0)
        use_fuzzy: Use fuzzy matching (requires rapidfuzz)
    
    Returns:
        Deduplicated list of strings
    """
    if not corpus:
        return []
    
    # First pass: exact hash deduplication
    seen_hashes: Set[str] = set()
    unique_texts: List[str] = []
    
    for text in corpus:
        if not text or not text.strip():
            continue
        
        text_hash = get_text_hash(text)
        if text_hash not in seen_hashes:
            seen_hashes.add(text_hash)
            unique_texts.append(text)
    
    # Second pass: fuzzy deduplication if available
    if use_fuzzy and FUZZY_AVAILABLE and len(unique_texts) > 1:
        final_texts: List[str] = []
        
        for text in unique_texts:
            is_duplicate = False
            normalized = normalize_text(text)
            
            for existing in final_texts:
                existing_normalized = normalize_text(existing)
                
                # Skip very short texts
                if len(normalized) < 50 or len(existing_normalized) < 50:
                    continue
                
                # Check similarity
                similarity = fuzz.ratio(normalized, existing_normalized) / 100.0
                if similarity >= similarity_threshold:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                final_texts.append(text)
        
        return final_texts
    
    return unique_texts


def categorize_by_topic(
    corpus: List[str],
    clusters: List[Dict[str, Any]],
    min_matches: int = 1
) -> Dict[str, List[str]]:
    """
    Categorize corpus items by topic clusters.
    
    Args:
        corpus: List of text strings
        clusters: Topic clusters from InfraNodus (with 'label' and 'hub_entities' or 'members')
        min_matches: Minimum keyword matches to assign to category
    
    Returns:
        Dict mapping cluster labels to list of relevant corpus items
    """
    categorized: Dict[str, List[str]] = defaultdict(list)
    uncategorized: List[str] = []
    
    # Build keyword sets for each cluster
    cluster_keywords: List[Tuple[str, Set[str]]] = []
    for cluster in clusters:
        label = cluster.get('label', f"Cluster {cluster.get('id', 0)}")
        keywords = set()
        
        # Add hub entities
        for entity in cluster.get('hub_entities', []):
            keywords.add(normalize_text(str(entity)))
        
        # Add members if available
        for member in cluster.get('members', []):
            keywords.add(normalize_text(str(member)))
        
        # Add label words
        for word in label.lower().split('/'):
            keywords.add(word.strip())
        
        cluster_keywords.append((label, keywords))
    
    # Categorize each corpus item
    for text in corpus:
        if not text:
            continue
        
        text_lower = normalize_text(text)
        best_match: Optional[str] = None
        best_count = 0
        
        for label, keywords in cluster_keywords:
            match_count = sum(1 for kw in keywords if kw and kw in text_lower)
            if match_count >= min_matches and match_count > best_count:
                best_match = label
                best_count = match_count
        
        if best_match:
            categorized[best_match].append(text)
        else:
            uncategorized.append(text)
    
    # Add uncategorized if any
    if uncategorized:
        categorized['Uncategorized'] = uncategorized
    
    return dict(categorized)


def extract_key_facts(
    corpus: str,
    min_sentence_length: int = 30,
    max_facts: int = 50
) -> List[Dict[str, Any]]:
    """
    Extract key factual statements from corpus text.
    
    Looks for sentences with numbers, statistics, specific claims.
    
    Args:
        corpus: Combined corpus text
        min_sentence_length: Minimum characters for a sentence
        max_facts: Maximum facts to extract
    
    Returns:
        List of dicts with 'fact', 'type', 'confidence' keys
    """
    facts: List[Dict[str, Any]] = []
    
    # Split into sentences
    sentences = re.split(r'[.!?]+', corpus)
    
    # Patterns that indicate factual content
    patterns = {
        'statistic': r'\d+(?:\.\d+)?%|\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:million|billion|thousand|percent))?',
        'comparison': r'(?:more|less|better|worse|higher|lower|faster|slower)\s+than',
        'specific_claim': r'(?:studies?\s+(?:show|found|suggest)|research\s+(?:indicates?|shows?)|according\s+to)',
        'time_reference': r'(?:in\s+\d{4}|since\s+\d{4}|over\s+the\s+(?:past|last)\s+\d+)',
        'named_entity': r'(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)'
    }
    
    for sentence in sentences:
        sentence = sentence.strip()
        
        if len(sentence) < min_sentence_length:
            continue
        
        if len(facts) >= max_facts:
            break
        
        # Check for factual patterns
        fact_type = 'general'
        confidence = 0.5
        
        for pattern_name, pattern in patterns.items():
            if re.search(pattern, sentence, re.IGNORECASE):
                fact_type = pattern_name
                confidence = 0.7 if pattern_name in ['statistic', 'specific_claim'] else 0.6
                break
        
        # Only include if it looks factual
        if confidence >= 0.6 or len(sentence) > 100:
            facts.append({
                'fact': sentence,
                'type': fact_type,
                'confidence': confidence,
                'length': len(sentence)
            })
    
    # Sort by confidence and length
    facts.sort(key=lambda x: (x['confidence'], x['length']), reverse=True)
    
    return facts[:max_facts]


def merge_research_results(
    results: List[Dict[str, Any]],
    include_sources: bool = True
) -> str:
    """
    Merge multiple research/search results into a single corpus.
    
    Args:
        results: List of search result dicts (from Parallel-Search or similar)
                Each should have 'answer', 'snippets', 'sources' or similar keys
        include_sources: Include source URLs in the corpus
    
    Returns:
        Merged corpus text
    """
    corpus_parts: List[str] = []
    seen_content: Set[str] = set()
    
    for result in results:
        # Handle different result formats
        
        # Answer/response
        answer = result.get('answer', result.get('response', result.get('text', '')))
        if answer:
            answer_hash = get_text_hash(answer)
            if answer_hash not in seen_content:
                seen_content.add(answer_hash)
                corpus_parts.append(answer.strip())
        
        # Snippets
        snippets = result.get('snippets', result.get('hits', result.get('results', [])))
        for snippet in snippets:
            if isinstance(snippet, dict):
                snippet_text = snippet.get('snippet', snippet.get('text', snippet.get('content', '')))
            else:
                snippet_text = str(snippet)
            
            if snippet_text:
                snippet_hash = get_text_hash(snippet_text)
                if snippet_hash not in seen_content:
                    seen_content.add(snippet_hash)
                    corpus_parts.append(snippet_text.strip())
        
        # Sources (if requested)
        if include_sources:
            sources = result.get('sources', result.get('urls', []))
            for source in sources:
                if isinstance(source, dict):
                    url = source.get('url', source.get('link', ''))
                    title = source.get('title', '')
                    if url:
                        source_text = f"Source: {title} - {url}" if title else f"Source: {url}"
                        corpus_parts.append(source_text)
                elif isinstance(source, str) and source.startswith('http'):
                    corpus_parts.append(f"Source: {source}")
    
    return '\n\n'.join(corpus_parts)


def calculate_source_quality(sources: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculate quality metrics for research sources.
    
    Args:
        sources: List of source dicts with 'url', 'domain', 'title' etc.
    
    Returns:
        Quality assessment dict
    """
    if not sources:
        return {
            'total_sources': 0,
            'quality_score': 0,
            'domain_diversity': 0
        }
    
    # High-authority domain patterns
    authority_patterns = [
        r'\.edu$',
        r'\.gov$',
        r'wikipedia\.org',
        r'github\.com',
        r'stackoverflow\.com',
        r'nature\.com',
        r'sciencedirect\.com',
        r'pubmed',
        r'arxiv\.org',
        r'forbes\.com',
        r'hbr\.org',
        r'nytimes\.com',
        r'wsj\.com'
    ]
    
    domains: Set[str] = set()
    authority_count = 0
    
    for source in sources:
        url = source.get('url', source.get('link', ''))
        if not url:
            continue
        
        # Extract domain
        domain_match = re.search(r'://([^/]+)', url)
        if domain_match:
            domain = domain_match.group(1).lower()
            domains.add(domain)
            
            # Check authority
            for pattern in authority_patterns:
                if re.search(pattern, domain):
                    authority_count += 1
                    break
    
    total = len(sources)
    
    return {
        'total_sources': total,
        'unique_domains': len(domains),
        'domain_diversity': len(domains) / total if total > 0 else 0,
        'authority_sources': authority_count,
        'authority_ratio': authority_count / total if total > 0 else 0,
        'quality_score': min(1.0, (len(domains) / 10 + authority_count / 5) / 2)
    }


def chunk_corpus(
    corpus: str,
    max_chunk_size: int = 10000,
    overlap: int = 500
) -> List[str]:
    """
    Split large corpus into overlapping chunks for processing.
    
    Args:
        corpus: Full corpus text
        max_chunk_size: Maximum characters per chunk
        overlap: Overlap between chunks
    
    Returns:
        List of text chunks
    """
    if len(corpus) <= max_chunk_size:
        return [corpus]
    
    chunks: List[str] = []
    start = 0
    
    while start < len(corpus):
        end = start + max_chunk_size
        
        # Try to break at sentence boundary
        if end < len(corpus):
            # Look for sentence end in last 200 chars of chunk
            search_region = corpus[end-200:end]
            last_period = search_region.rfind('.')
            if last_period > 0:
                end = end - 200 + last_period + 1
        
        chunks.append(corpus[start:end].strip())
        start = end - overlap
    
    return chunks


def format_corpus_for_llm(
    categorized_corpus: Dict[str, List[str]],
    max_total_length: int = 100000
) -> str:
    """
    Format categorized corpus for LLM consumption.
    
    Args:
        categorized_corpus: Output from categorize_by_topic()
        max_total_length: Maximum total characters
    
    Returns:
        Formatted corpus string
    """
    sections: List[str] = []
    total_length = 0
    
    for category, items in categorized_corpus.items():
        if total_length >= max_total_length:
            break
        
        section = f"## {category}\n\n"
        
        for item in items:
            if total_length + len(item) > max_total_length:
                break
            section += f"- {item}\n\n"
            total_length += len(item) + 4
        
        sections.append(section)
    
    return '\n'.join(sections)






