/**
 * chatbotApi.js — AI Chatbot Service
 * POSTs to /chat/ on the FastAPI backend.
 * Falls back to a local rule-based mock when the server is unreachable.
 */
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  timeout: 15000,
});

// ── Rule-based fallback responses ────────────────────────────────────
const RULES = [
  { pattern: /purple blotch|blotch/i,   reply: "**पर्पल ब्लॉच** (*Alternaria porri*) हा सामान्य कांदा रोग आहे. यामुळे पाण्याने भिजलेले जखम तयार होतात जे तपकिरी/जांभळ्या रंगाचे होतात. **मॅन्कोझेब-आधारित** फंजिसाइड वापरून नियंत्रण करा आणि अच्छ्या ड्रेनेजची व्यवस्था करा." },
  { pattern: /downy mildew|mildew|mildew/i,    reply: "**ओसी चिलमिरी** (*Peronospora destructor*) हवामान ठंडे व ओलसद असते तेव्हा वाढते. पानांवर हलके हरे/पिवळे धब्बे दिसतात. **मेटालॅक्सिल फंजिसाइड** लागू करा आणि हवेचे प्रवाह सुधारा." },
  { pattern: /stemphylium|leaf blight|blight/i,reply: "**स्टेमफिलियम पत्र्यावरील धुसर रोग** तपकिरी किंवा हलक्या तपकिरी जखमांसह पिवळ्या सीमा दर्शवतो. **इप्रोडिओन किंवा क्लोरोथॅलोनील** फवारण्या वापरा आणि अतिरिक्त नायट्रोजन टाळा." },
  { pattern: /healthy|no disease|no|good/i,     reply: "शानदार बातमी! स्वस्थ पिका सुद्धा नियमित निरीक्षण करणे आवश्यक आहे. **संतुलित खत**, योग्य सिंचन आणि **साप्ताहिक पाहणी** सुरू ठेवा." },
  { pattern: /treatment|cure|control|spray/i, reply: "उपचार विशिष्ट रोगावर अवलंबून असते. सामान्य टिप्स: (१) संक्रमित भाग काढून नष्ट करा. (२) लवकरच योग्य **फंजिसाइड** लागू करा. (३) ड्रेनेज आणि हवेचा प्रवाह सुधारा. (४) **पिके घूर्णन** करा." },
  { pattern: /weather|rain|irrigat|humidity/i,   reply: "**हवामान** रोग प्रसारमध्ये महत्वाची भूमिका बजावते. उच्च आर्द्रता (>७०%) बुरशीजन्य रोगांना अनुकूल आहे. **ओव्हरहेड सिंचन** टाळा. **हवामान** टॅबमध्ये स्थानिक परिस्थिती तपासा." },
  { pattern: /prevent|prevention|protect/i,        reply: "**प्रतिबंध** उपचारापेक्षा उत्तम आहे! **रोग-मुक्त बीज** वापरा, **३-वर्षीय पिके घूर्णन** करा, योग्य अंतरण राखा आणि **उच्च-जोखीम काळात** प्रतिबंधक फंजिसाइड लागू करा." },
  { pattern: /confiden|accuracy|trust|model/i,       reply: "आमचा **AI मॉडेल** हजारो कांदा पिकाच्या चित्रांवर प्रशिक्षित आहे. **आत्मविश्वास >८५%** अत्यंत विश्वासार्ह आहे. सीमावर्ती परिणाम (<६०%) साठी स्पष्ट चित्र अपलोड करा किंवा **स्थानिक कृषिविज्ञानी** सल्ला घ्या." },
  { pattern: /hello|hi|hey|नमस्|नमस्कार|greet/i,     reply: "नमस्कार शेतकरी! 👋 मी **AgroVision AI सहायक** आहे. कांदा रोग, उपचार पर्याय, शेतीवर हवामान प्रभाव किंवा हा प्लॅटफॉर्म कसे वापरायचे याबद्दल मला विचारा." },
  { pattern: /thank|धन्यवाद|आभारी/i,                  reply: "स्वागत आहे! **शुभ शेती!** 🌿 आपल्या पिकांबद्दल कोणतेही प्रश्न विचारण्यास मुक्त आहात." },
  { pattern: /upload|image|photo|चित्र|फोटो/i,     reply: "**रोग शोधण्यासाठी:** **होम** किंवा **डॅशबोर्ड** वर जा, **चांगल्या प्रकाशात** संक्रमित पानाचा स्पष्ट चित्र अपलोड करा, नंतर **'विश्लेषण करा'** क्लिक करा. परिणाम **सेकंदांमध्ये** दिसतात!" },
  { pattern: /onion|bulb|कांदा|प्याज/i,             reply: "**कांदा** (*Allium cepa*) अनेक रोगांना संवेदनशील आहे: पर्पल ब्लॉच, स्टेमफिलियम ब्लाइट, ओसी चिलमिरी, बॉट्रिटिस पत्र्यावरील धुसर रोग आणि फ्यूजेरियम बेसल रॉट. **लवकरच शोधणे** पिकांच्या नुकसानास कमी करण्याचा मुख्य उपाय आहे." },
];

const FALLBACKS = [
  "मी पिकांच्या रोग शोधण्याने आणि व्यवस्थापनामध्ये मदत करतो. आपल्या प्रश्नाबद्दल अधिक विशिष्ट होऊ शकता?",
  "हे एक बहुतेक प्रश्न आहे! अचूक सल्लासाठी, आमच्या **AI शोधण्याच्या परिणामांसह** स्थानिक **कृषिविज्ञानी** सल्ला घ्या.",
  "मी **रोग ओळख**, **उपचार सुझाव** आणि **हवामान-आधारित शेती सल्ला** देऊ शकतो. आपल्याला काय जाणून घ्यायचे आहे?",
];

let fallbackIndex = 0;
const mockReply = (message) => {
  for (const rule of RULES) {
    if (rule.pattern.test(message)) return rule.reply;
  }
  return FALLBACKS[fallbackIndex++ % FALLBACKS.length];
};

/**
 * Send a message to the chatbot.
 * @param {string} message
 * @param {Array<{role:string, content:string}>} history
 * @returns {Promise<string>} bot reply
 */
/**
 * Send a message to the chatbot.
 * @param {string} message — User message
 * @param {Array<{role:string, content:string}>} history — Conversation history
 * @returns {Promise<string>} bot reply (real or fallback)
 */
export const sendMessage = async (message, history = []) => {
  try {
    const response = await API.post('/chat/', {
      message,
      history: history.map(m => ({ role: m.role, content: m.content })),
    });
    
    const reply = response.data?.reply || response.data?.message;
    if (reply) return reply;
    
    // Fallback if API returns empty response
    console.warn("[Chatbot] Empty API response, using fallback");
    return mockReply(message);
  } catch (error) {
    // Backend unavailable — use local fallback
    await new Promise(r => setTimeout(r, 600 + Math.random() * 600));
    const errorMsg = error?.response?.status 
      ? `API Error ${error.response.status}` 
      : error?.message || "Connection error";
    console.warn("[Chatbot] Using fallback due to:", errorMsg);
    return mockReply(message);
  }
};