from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="Digital Data Transmission Using Manchester Encoding and Decoding")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class MessageRequest(BaseModel):
    message: str


def bytes_to_bits(data: bytes) -> str:
    return ''.join(f'{b:08b}' for b in data)

def manchester_encode(bits: str) -> str:
    # Convention used in this demo: 0 -> 01, 1 -> 10
    return ''.join('01' if bit == '0' else '10' for bit in bits)

def manchester_decode(signal: str) -> str:
    if len(signal) % 2:
        raise ValueError("Manchester stream must contain an even number of bits")
    pairs = [signal[i:i+2] for i in range(0, len(signal), 2)]
    decoded = []
    for pair in pairs:
        if pair == '01': decoded.append('0')
        elif pair == '10': decoded.append('1')
        else: raise ValueError(f"Invalid Manchester pair: {pair}")
    return ''.join(decoded)

def bits_to_text(bits: str) -> str:
    if len(bits) % 8:
        raise ValueError("Decoded data is not byte aligned")
    raw = bytes(int(bits[i:i+8], 2) for i in range(0, len(bits), 8))
    return raw.decode('utf-8')

@app.get("/")
def root():
    return {"status": "online", "project": "Digital Data Transmission Using Manchester Encoding and Decoding"}

@app.post("/api/communicate")
def communicate(payload: MessageRequest):
    message = payload.message
    if not message:
        return {"status": "Error", "message": "Enter a message first."}
    if len(message) > 120:
        return {"status": "Error", "message": "Use 120 characters or fewer for the live demo."}

    raw = message.encode('utf-8')
    source_bits = bytes_to_bits(raw)
    encoded = manchester_encode(source_bits)

    # Ideal digital channel for the classroom demonstration.
    transmitted = encoded
    recovered_bits = manchester_decode(transmitted)
    recovered_message = bits_to_text(recovered_bits)

    ascii_values = list(raw)
    success = recovered_message == message and recovered_bits == source_bits

    return {
        "status": "Success",
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "original_message": message,
        "ascii_values": ascii_values,
        "binary_data": source_bits,
        "encoding_scheme": "Manchester (0 → 01, 1 → 10)",
        "encoded_signal": encoded,
        "transmitted_signal": transmitted,
        "decoded_binary": recovered_bits,
        "recovered_message": recovered_message,
        "success": success,
        "source_bits": len(source_bits),
        "channel_bits": len(transmitted),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
