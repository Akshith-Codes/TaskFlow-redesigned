const PRIORITY_COLORS = {
  low: { color: "#44dd88", bg: "rgba(68,221,136,0.08)", border: "rgba(68,221,136,0.2)" },
  medium: { color: "#f0c040", bg: "rgba(240,192,64,0.08)", border: "rgba(240,192,64,0.2)" },
  high: { color: "#ff4444", bg: "rgba(255,68,68,0.08)", border: "rgba(255,68,68,0.2)" },
};

const STATUS_CONFIG = {
  ongoing: { color: "#ff4444", label: "TODO", dotStyle: "border: 2px solid #ff4444; background: transparent" },
  doing: { color: "#f0c040", label: "IN PROGRESS", dotStyle: "border: 2px dashed #f0c040; background: transparent" },
  done: { color: "#44dd88", label: "DONE", dotStyle: "border: 2px solid #44dd88; background: #44dd88" },
};

function CardItem({ card, listId, handleDragStart, changeStatus, deleteCard, getCardColor, getCircleStyle }) {
  const sc = STATUS_CONFIG[card.status] || STATUS_CONFIG.ongoing;
  const pc = PRIORITY_COLORS[card.priority || "medium"];

  return (
    <div draggable onDragStart={() => handleDragStart(listId, card)}
      style={{ background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "8px", padding: "14px", cursor: "grab", position: "relative", transition: "border-color 0.15s, transform 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>

      {/* Priority accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", borderRadius: "8px 0 0 8px", background: pc.color, opacity: 0.8 }} />

      <div style={{ paddingLeft: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <button onClick={() => changeStatus(listId, card._id)}
            style={{ width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0, marginTop: "2px", cursor: "pointer", transition: "transform 0.15s", ...Object.fromEntries(card.status === "done" ? [["background","#44dd88"],["border","2px solid #44dd88"]] : card.status === "doing" ? [["background","transparent"],["border","2px dashed #f0c040"]] : [["background","transparent"],["border","2px solid #ff4444"]]) }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            title="Click to change status" />

          <button onClick={() => deleteCard(listId, card._id)}
            style={{ background: "none", border: "none", fontSize: "16px", color: "var(--text-muted)", lineHeight: 1, marginLeft: "8px", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; }}>
            ×
          </button>
        </div>

        <p style={{ fontSize: "13px", fontWeight: 500, color: card.status === "done" ? "var(--text-secondary)" : "var(--text-primary)", lineHeight: 1.5, wordBreak: "break-word", textDecoration: card.status === "done" ? "line-through" : "none", marginBottom: "6px" }}>
          {card.title}
        </p>

        {card.description && (
          <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, wordBreak: "break-word", marginBottom: "8px" }}>
            {card.description}
          </p>
        )}

        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "8px" }}>
          {/* Priority tag */}
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.8px", padding: "2px 7px", borderRadius: "3px", background: pc.bg, border: `1px solid ${pc.border}`, color: pc.color, textTransform: "uppercase" }}>
            {card.priority || "medium"}
          </span>
          {/* Status tag */}
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.8px", padding: "2px 7px", borderRadius: "3px", background: "var(--bg-elevated)", border: "1px solid var(--border)", color: sc.color, textTransform: "uppercase" }}>
            {sc.label}
          </span>
        </div>

        {card.attachments?.length > 0 && (
          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "3px" }}>
            {card.attachments.map((file, i) => (
              <a key={i} href={`http://localhost:5000/${file}`} target="_blank" rel="noreferrer"
                style={{ fontSize: "11px", color: "var(--blue)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
                onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; }}
                onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; }}>
                ⇗ Attachment {i + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardItem;
