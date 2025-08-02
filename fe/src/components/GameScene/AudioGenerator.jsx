import React, { useEffect } from "react";
import axios from "axios";

const SARVAM_URL = "https://api.sarvam.ai/text-to-speech"
const SARVAM_API_KEY = "f5071af4-ebce-43d1-bd35-29d7cc13d985"

const AudioGenerator = async (text, speaker="misha", language="English") => {

    if (!text || text === '') {
      console.error("No text provided.");
      return;
    }
    var pitch = 0.2
    var loudness = 2.5
    var speechSampleRate = 22050
    var targetLanguageCode = "en-IN"
    if (speaker === "vian"){
      pitch = 0
      loudness = 1.5
      speechSampleRate = 16000
    }
    if (language === "Hindi"){
      targetLanguageCode = "hi-IN"
    }
    console.log(targetLanguageCode, "===targetLanguageCode")
    const base64ToBlob = (base64, mimeType) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

    var PAYLOAD = {
        "inputs": [text],
        "target_language_code": targetLanguageCode,
        "speaker": speaker,
        "pitch": pitch,
        "pace": 1.2,
        "loudness": loudness,
        "speech_sample_rate": 22050,
        "enable_preprocessing": true,
        "model": "bulbul:v1",
    
        "override_triplets": {}
    }
    const response = await axios({
        method: 'post',
        url: SARVAM_URL,
        data: PAYLOAD,
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': SARVAM_API_KEY
        }
    });
    const base64Audio = response.data.audios[0]
    const audioBlob = base64ToBlob(base64Audio, "audio/wav");
    const url = URL.createObjectURL(audioBlob);
    return url
};

export default AudioGenerator;