import React, { useState } from "react";
import "./App.css";

function App() {
  const [texts, setTexts] = useState([]);
  const [inputText, setInputText] = useState(""); 
  const [selectedTextId, setSelectedTextId] = useState(null); 
  const [history, setHistory] = useState([]); 
  const [redoStack, setRedoStack] = useState([]); 
  const [fontSize, setFontSize] = useState(16); 
  const [fontStyle, setFontStyle] = useState("normal"); 
  const [fontWeight, setFontWeight] = useState("normal"); 
  const [textDecoration, setTextDecoration] = useState("none"); 
  const [fontFamily, setFontFamily] = useState("Arial");

  
  const handleAddOrEditText = () => {
    if (selectedTextId) {
      
      const updatedTexts = texts.map((text) =>
        text.id === selectedTextId
          ? { ...text, content: inputText, fontSize, fontStyle, fontWeight, textDecoration, fontFamily }
          : text
      );
      saveHistory();
      setTexts(updatedTexts);
      setSelectedTextId(null);
    } else {
      
      const newText = {
        id: Date.now(),
        content: inputText,
        x: 50,
        y: 50,
        fontSize,
        fontStyle,
        fontWeight,
        textDecoration,
        fontFamily,
      };
      saveHistory();
      setTexts([...texts, newText]);
    }
    setInputText("");
  };

 
  
  const moveText = (id, x, y) => {
    const updatedTexts = texts.map((text) =>
      text.id === id ? { ...text, x, y } : text
    );
    saveHistory();
    setTexts(updatedTexts);
  };

  
  const saveHistory = () => {
    setHistory([...history, texts]);
    setRedoStack([]);
  };

  
  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history.pop();
      setRedoStack([texts, ...redoStack]);
      setTexts(previousState);
    }
  };

  
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.shift();
      setHistory([...history, texts]);
      setTexts(nextState);
    }
  };

  return (
    <div className="App">
  <header>
    <button onClick={handleUndo} disabled={history.length === 0}>
      Undo
    </button>
    <button onClick={handleRedo} disabled={redoStack.length === 0}>
      Redo
    </button>
  </header>

  <div className="canvas-wrapper">
    <div className="canvas-container">
      {texts.map((text) => (
        <DraggableText 
        key={text.id} 
        text={text} 
        onMove={moveText}
        onSelect={() => {
          setSelectedTextId(text.id);
          setInputText(text.content);
          setFontSize(text.fontSize);
          setFontStyle(text.fontStyle);
          setFontWeight(text.fontWeight);
          setTextDecoration(text.textDecoration);
          setFontFamily(text.fontFamily);
        }} />
      ))}
    </div>

    <div className="controls-container">
    <div className="font-controls">
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          >
            {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          <button
            data-active={fontWeight === "bold"}
            onClick={() => setFontWeight(fontWeight === "bold" ? "normal" : "bold")}
          >
            Bold
          </button>
          <button
            data-active={fontStyle === "italic"}
            onClick={() => setFontStyle(fontStyle === "italic" ? "normal" : "italic")}
          >
            Italic
          </button>
          <button
            data-active={textDecoration.includes("underline")}
            onClick={() =>
              setTextDecoration(
                textDecoration.includes("underline") ? "none" : "underline"
              )
            }
          >
            Underline
          </button>
        </div>
    </div>

    <div className="input-container">
      <input
        type="text"
        placeholder="Enter text here"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={handleAddOrEditText}>
        {selectedTextId ? "Edit Text" : "Add Text"}
      </button>
    </div>
  </div>
</div>

  );
}

function DraggableText({ text, onMove }) {
  const handleDrag = (e) => {
    const canvas = document.querySelector(".canvas-container");
    const canvasRect = canvas.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.min(canvasRect.width - e.target.offsetWidth, e.clientX - canvasRect.left - e.target.offsetWidth / 2)
    );
    const y = Math.max(
      0,
      Math.min(canvasRect.height - e.target.offsetHeight, e.clientY - canvasRect.top - e.target.offsetHeight / 2)
    );

    onMove(text.id, x, y);
  };

  return (
    <div
      className="draggable-text"
      style={{
        position: "absolute",
        left: text.x,
        top: text.y,
        fontSize: `${text.fontSize}px`,
        fontWeight: text.fontWeight,
        fontStyle: text.fontStyle,
        textDecoration: text.textDecoration, 
        fontFamily: text.fontFamily, 
      }}
      draggable
      onDragEnd={handleDrag}
    >
      <span>{text.content}</span>
    </div>
  );
}

export default App;
