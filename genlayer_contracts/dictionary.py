# { "Depends": "py-genlayer:test" }
from genlayer import *
from dataclasses import dataclass
import json

@allow_storage
@dataclass
class WordAnalysis:
    analysis_id: str
    word_or_phrase: str
    author: str
    overview: str
    key_points: DynArray[str]
    best_practices: DynArray[str]
    warnings: DynArray[str]
    summary: str
    timestamp: u64

class AIDictionary(gl.Contract):
    analyses: TreeMap[str, WordAnalysis]
    user_analyses: TreeMap[str, DynArray[str]]
    analysis_count: u64
    
    def __init__(self):
        pass  # GenLayer auto-initializes all storage fields to their default values
    
    def _normalize_address(self, address: str) -> str:
        """Normalize address to lowercase with 0x prefix"""
        normalized = address.lower()
        if not normalized.startswith('0x'):
            normalized = '0x' + normalized
        return normalized
    
    @gl.public.write
    def analyze_word(self, word_or_phrase: str):
        """Analyze a word or phrase without minimum word limit"""
        if not word_or_phrase or len(word_or_phrase.strip()) == 0:
            raise Exception("Word or phrase cannot be empty")
        
        # Use custom run_nondet pattern for structured JSON data
        prompt = f"""You are an expert lexicographer. I will give you a single English word or phrase.

From it, extract the following structured insights in JSON format based on this schema:

- overview: A short description of the word/phrase, including its part of speech and usage context.
- keyPoints: An array of key details such as part of speech, etymology, word origin, or typical usage domain.
- bestPractices: An array of correct usage tips or grammatical notes. Each should be phrased as a helpful instruction.
- warnings: An array of common usage mistakes, misinterpretations, or pronunciation errors (if any).
- summary: A concise definition of the word/phrase (1–2 sentences), suitable for learners.

If any section does not apply to the word, return it as an empty array.

Now analyze the following word or phrase:

"{word_or_phrase}"

You MUST respond in this EXACT JSON format with NO additional text or markdown:
{{"overview": "...", "keyPoints": [...], "bestPractices": [...], "warnings": [...], "summary": "..."}}"""
        
        def leader_fn():
            response = gl.nondet.exec_prompt(prompt)
            # Clean any markdown formatting
            cleaned = response.replace("```json", "").replace("```", "").strip()
            # Parse and return as dict
            return json.loads(cleaned)
        
        def validator_fn(leader_res: gl.vm.Result) -> bool: # type: ignore
            # Check if leader got an error
            if not isinstance(leader_res, gl.vm.Return):
                return False
            
            leader_data = leader_res.calldata
            
            # Validate structure
            if not isinstance(leader_data, dict):
                return False
            required_fields = ["overview", "keyPoints", "bestPractices", "warnings", "summary"]
            if not all(field in leader_data for field in required_fields):
                return False
            
            # Validate overview exists
            overview = leader_data["overview"]
            if not isinstance(overview, str) or len(overview) < 5:
                return False
            
            # Validate arrays
            for field in ["keyPoints", "bestPractices", "warnings"]:
                if not isinstance(leader_data[field], list):
                    return False
            
            # Validate summary exists
            summary = leader_data["summary"]
            if not isinstance(summary, str) or len(summary) < 5:
                return False
            
            return True
        
        # Get analysis result as dict
        analysis = gl.vm.run_nondet(leader_fn, validator_fn)
        
        # Extract values from dict
        overview_value = analysis.get("overview", "")
        key_points_value = analysis.get("keyPoints", [])
        best_practices_value = analysis.get("bestPractices", [])
        warnings_value = analysis.get("warnings", [])
        summary_value = analysis.get("summary", "")
        
        # Increment analysis count
        self.analysis_count = u64(int(self.analysis_count) + 1)
        analysis_id = f"analysis_{self.analysis_count}"
        
        timestamp = self.analysis_count
        
        # Normalize the sender address before storing
        sender_str = self._normalize_address(str(gl.message.sender_address))
        
        # Create analysis result
        result = WordAnalysis(
            analysis_id=analysis_id,
            word_or_phrase=word_or_phrase.strip(),
            author=sender_str,
            overview=overview_value,
            key_points=key_points_value,
            best_practices=best_practices_value,
            warnings=warnings_value,
            summary=summary_value,
            timestamp=timestamp
        )
        
        # Store in analyses map
        self.analyses[analysis_id] = result
        
        # Update user analyses
        if sender_str in self.user_analyses:
            user_analyses = self.user_analyses[sender_str]
            user_analyses.append(analysis_id)
            self.user_analyses[sender_str] = user_analyses
        else:
            # Use regular Python list - GenLayer converts it to DynArray automatically
            self.user_analyses[sender_str] = [analysis_id]
    
    @gl.public.view
    def get_analysis(self, analysis_id: str) -> WordAnalysis:
        if analysis_id not in self.analyses:
            raise Exception(f"Analysis {analysis_id} not found")
        return self.analyses[analysis_id]
    
    @gl.public.view
    def get_user_analyses(self, user_address: str) -> DynArray[WordAnalysis]:
        # Normalize the address format
        normalized_address = self._normalize_address(user_address)
        
        if normalized_address not in self.user_analyses:
            return []  # type: ignore # Return empty list, not DynArray()
        
        analysis_ids = self.user_analyses[normalized_address]
        
        result_list = []  # Use plain list, not DynArray()
        for analysis_id in analysis_ids:
            if analysis_id in self.analyses:
                result_list.append(self.analyses[analysis_id])
        
        return result_list  # type: ignore # Return list - GenLayer converts to DynArray
    
    @gl.public.view
    def get_analysis_count(self) -> int:
        return int(self.analysis_count)
    
    @gl.public.view
    def get_latest_analysis_id(self) -> str:
        if self.analysis_count == u64(0):
            return ""
        return f"analysis_{self.analysis_count}"