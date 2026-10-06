# Digital Data Transmission Using Manchester Encoding and Decoding

Digital Communication mini project demonstrating the complete transmitter-to-receiver path:

Source Message → UTF-8/ASCII → Binary → Manchester Encoder → Digital Channel → Manchester Decoder → Binary → Recovered Message

Manchester convention used: `0 → 01`, `1 → 10`.

## Run on Windows
1. Double-click `START_BACKEND.bat` and keep the terminal open.
2. Wait for `Uvicorn running on http://127.0.0.1:8000`.
3. Double-click `START_FRONTEND.bat` and keep the second terminal open.
4. Open `http://localhost:3000`.
5. Enter a message such as `HELLO` and click **ENCODE & TRANSMIT**.

The page shows ASCII values, source binary, Manchester encoder output, digital channel signal, decoded binary, transmitter/receiver waveforms, and the recovered message.

The IDS/security demonstration from the earlier version has been completely removed so the project is focused only on Digital Communication.
