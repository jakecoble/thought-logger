import React, { useEffect, useState } from "react";

const ApiKeySettings = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [keyStatus, setKeyStatus] = useState<{hasKey: boolean, message: string} | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{text: string, isError: boolean} | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const status = await window.openRouter.checkApiKey();
    setKeyStatus(status);
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      setMessage({ text: "API key cannot be empty", isError: true });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const result = await window.openRouter.saveApiKey(apiKey);
      
      if (result.success) {
        setMessage({ text: result.message, isError: false });
        setApiKey("");
        checkApiKey();
      } else {
        setMessage({ text: result.message, isError: true });
      }
    } catch (error) {
      setMessage({ text: "An error occurred while saving the API key", isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h3>OpenRouter API Key</h3>
      
      <div style={{ marginBottom: 12 }}>
        {keyStatus && (
          <div style={{ color: keyStatus.hasKey ? "#0a0" : "#a00" }}>
            {keyStatus.message}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter OpenRouter API key"
          style={{ width: "300px" }}
        />
        <button 
          onClick={saveApiKey} 
          disabled={isSaving}
          style={{ marginLeft: 8 }}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
      
      {message && (
        <div style={{ color: message.isError ? "#a00" : "#0a0" }}>
          {message.text}
        </div>
      )}
      
      <div style={{ fontSize: 12, marginTop: 12 }}>
        <em>
          OpenRouter API key is required for text extraction from screenshots.
          Get your API key at <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.userData.openExternalUrl("https://openrouter.ai/keys");
            }}
            style={{ color: "blue", textDecoration: "none", cursor: "pointer" }}
          >openrouter.ai/keys</a>
        </em>
      </div>
    </div>
  );
};

export default ApiKeySettings; 