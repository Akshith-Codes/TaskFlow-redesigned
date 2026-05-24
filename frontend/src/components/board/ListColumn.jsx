import { useState } from "react";
import CardItem from "./CardItem";

const PRIORITY_OPTIONS = ["low", "medium", "high"];
const PRIORITY_COLORS = {
  low: { color: "#44dd88", bg: "rgba(68,221,136,0.08)", border: "rgba(68,221,136,0.25)" },
  medium: { color: "#f0c040", bg: "rgba(240,192,64,0.08)", border: "rgba(240,192,64,0.25)" },
  high: { color: "#ff4444", bg: "rgba(255,68,68,0.08)", border: "rgba(255,68,68,0.25)" },
};

function ListColumn({ list, handleDrop, handleDragStart, changeStatus, deleteCard, deleteList, updateInput, addCard, getCardColor, getCircleStyle }) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [isDragOver, setIsDragOver] = useState(false);

  const doneCount = list.cards.filter(c => c.status === "done").length;
  const progress = list.cards.length > 0 ? Math.round((doneCount / list.cards.length) * 100) : 0;

  function handleAddCard() {
    addCard(list._id, priority);
    setIsAddingCard(false);
    setPriority("medium");
  }

  return (
    <div onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={() => { handleDrop(list._id); setIsDragOver(false); }}
      style={{ background: isDragOver ? "var(--bg-elevated)" : "var(--bg-surface)", border: `1px solid ${isDragOver ? "var(--border-bright)" : "var(--border)"}`, borderRadius: "8px", padding: "16px", minHeight: "280px", transition: "all 0.15s", display: "flex", flexDirection: "column" }}>

      {/* Column header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.3px", wordBreak: "break-word" }}>
              {list.title}
            </h2>
            <span style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1px 7px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", flexShrink: 0 }}>
              {list.cards.length}
            </span>
          </div>
          {/* Progress bar */}
          {list.cards.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              <div style={{ height: "3px", background: "var(--bg-elevated)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#44dd88" : progress > 50 ? "#f0c040" : "#ff4444", borderRadius: "2px", transition: "width 0.3s" }} />
              </div>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px", letterSpacing: "0.5px" }}>{doneCount}/{list.cards.length} DONE</p>
            </div>
          )}
        </div>
        <button onClick={() => deleteList(list._id)}
          style={{ background: "none", border: "none", fontSize: "16px", color: "var(--text-muted)", flexShrink: 0, marginLeft: "8px", lineHeight: 1 }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; }}>
          ×
        </button>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minHeight: "60px" }}>
        {list.cards.map(card => (
          <CardItem key={card._id} card={card} listId={list._id}
            handleDragStart={handleDragStart} changeStatus={changeStatus} deleteCard={deleteCard}
            getCardColor={getCardColor} getCircleStyle={getCircleStyle} />
        ))}
        {list.cards.length === 0 && !isAddingCard && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--border)", borderRadius: "6px", minHeight: "60px" }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Drop cards here</p>
          </div>
        )}
      </div>

      {/* Add card section */}
      <div style={{ marginTop: "12px" }}>
        {isAddingCard ? (
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "12px" }}>
            <input type="text" placeholder="Card title..." value={list.inputTitle}
              onChange={e => updateInput(list._id, "inputTitle", e.target.value)}
              style={{ marginBottom: "8px" }} autoFocus />
            <textarea placeholder="Description (optional)" value={list.inputDesc}
              onChange={e => updateInput(list._id, "inputDesc", e.target.value)}
              rows="2" style={{ resize: "none", marginBottom: "10px" }} />
            {/* Priority */}
            <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
              {PRIORITY_OPTIONS.map(p => {
                const pc = PRIORITY_COLORS[p];
                return (
                  <button key={p} onClick={() => setPriority(p)}
                    style={{ flex: 1, background: priority === p ? pc.bg : "transparent", border: `1px solid ${priority === p ? pc.border : "var(--border)"}`, borderRadius: "4px", padding: "4px", fontSize: "9px", fontWeight: 700, color: priority === p ? pc.color : "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    {p}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={handleAddCard}
                style={{ flex: 1, background: "var(--text-primary)", color: "var(--bg-base)", border: "none", borderRadius: "5px", padding: "8px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                ADD
              </button>
              <button onClick={() => { setIsAddingCard(false); updateInput(list._id, "inputTitle", ""); updateInput(list._id, "inputDesc", ""); }}
                style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "5px", padding: "8px 12px", fontSize: "11px", fontWeight: 600 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAddingCard(true)}
            style={{ width: "100%", background: "transparent", border: "1px dashed var(--border)", borderRadius: "6px", padding: "8px", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.5px" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
            + ADD CARD
          </button>
        )}
      </div>
    </div>
  );
}

export default ListColumn;
