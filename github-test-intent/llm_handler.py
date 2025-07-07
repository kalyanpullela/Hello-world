from transformers import pipeline

pipe = pipeline(
    "text-generation",
    model="deepseek-ai/deepseek-coder-1.3b-base",
    trust_remote_code=True
)

def analyze_test(test_code: str):
    prompt = f"""
Given the following Python test, extract its intent and generate a full implementation:

Test Code:
{test_code}

Output should be JSON with 'intent' and 'implementation'.
"""
    response = pipe(prompt, max_new_tokens=300)[0]['generated_text']
    
    # crude extract (replace with json.loads + regex if needed)
    intent_start = response.find("intent") + 8
    intent_end = response.find("\n", intent_start)
    intent = response[intent_start:intent_end].strip(":\" ")

    impl_start = response.find("implementation") + 15
    implementation = response[impl_start:].strip(": \n")

    return intent, implementation
