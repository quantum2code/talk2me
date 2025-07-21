# 🗣️ Talk2Me – AI Speech Practice App

**Talk2Me** is an AI-powered mobile/web app designed to help users improve their spoken English through real-time speech analysis. Record your voice, get accurate transcriptions, and receive personalized feedback on grammar, fluency, and tone

---

## 🌟 Features

- 🎤 **Record Speech**  
  Use your microphone to capture audio directly from your mobile device or browser.

- ✍️ **Accurate Transcription**  
  Audio is transcribed using Whisper API for highly accurate, multilingual speech-to-text conversion.

- 🤖 **Smart Feedback**  
  - Grammar corrections
  - Fluency scoring
  - Feedback on pacing, tone, and coherence

- 📚 **User History**  
  All transcripts and feedback are saved per user for continuous learning and improvement.

# steps to run in dev

- Add your ` .env ` file inside ` backend/express/ ` folder
- add 2 Env variables `PORT` & ` GROQ_API_KEY ` 
- get your groq api key from [here](https://console.groq.com/keys)
- `PORT=3000` as a standard value

``` bash
cd frontend/react-fe
npm run dev 
```
``` bash
cd backend/express
npm run dev
```
- now goto the frontend url to test it

## 👥 Contributors

Thanks to all the amazing people who contribute to this project!

[![Contributors](https://contrib.rocks/image?repo=quantum2code/talk2me)](https://github.com/quantum2code/talk2me/graphs/contributors)

