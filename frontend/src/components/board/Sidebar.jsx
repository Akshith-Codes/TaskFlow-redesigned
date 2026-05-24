import { useState } from "react";

const PRIORITY_COLORS = {
  low: { color: "#44dd88", bg: "rgba(68,221,136,0.08)", border: "rgba(68,221,136,0.25)" },
  medium: { color: "#f0c040", bg: "rgba(240,192,64,0.08)", border: "rgba(240,192,64,0.25)" },
  high: { color: "#ff4444", bg: "rgba(255,68,68,0.08)", border: "rgba(255,68,68,0.25)" },
};

function Sidebar({ newListName, setNewListName, addList, globalTitle, setGlobalTitle, globalDesc, setGlobalDesc, addGlobalCard, globalCards, deleteGlobalCard, handleDragStart, setShowMembers, setShowSettings }) {
  const [cardPriority, setCardPriority] = useState("medium");
  const [activeNav, setActiveNav] = useState("boards");
  const [collapsed, setCollapsed] = useState(false);

  function handleAddGlobalCard() {
    addGlobalCard(cardPriority);
  }

  const navItems = [
    { id: "boards", label: "Boards" },
    { id: "members", label: "Members", action: () => setShowMembers(true) },
    { id: "settings", label: "Settings", action: () => setShowSettings(true) },
  ];

  if (collapsed) return (
    <aside style={{ width: "52px", background: "var(--bg-surface)", borderRight: "1px solid var(--border)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "16px", gap: "8px", position: "sticky", top: 0 }}>
      <button onClick={() => setCollapsed(false)}
        style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "18px", padding: "8px", borderRadius: "6px" }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-elevated)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "none"; }}>
        →
      </button>
    </aside>
  );

  return (
    <aside style={{ width: "300px", background: "var(--bg-surface)", borderRight: "1px solid var(--border)", minHeight: "100vh", display: "flex", flexDirection: "column", position: "sticky", top: 0, flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="mono" style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>TaskFlow</h1>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", letterSpacing: "0.5px" }}>WORKSPACE</p>
        </div>
        <button onClick={() => setCollapsed(true)}
          style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "16px", padding: "4px 8px", borderRadius: "4px" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-elevated)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "none"; }}>
          ←
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 12px" }}>
        {navItems.map(item => (
          <button key={item.id}
            onClick={() => { setActiveNav(item.id); if (item.action) item.action(); }}
            style={{ display: "flex", alignItems: "center", width: "100%", textAlign: "left", background: activeNav === item.id ? "var(--bg-elevated)" : "none", border: "none", borderRadius: "6px", padding: "9px 12px", fontSize: "13px", fontWeight: 500, color: activeNav === item.id ? "var(--text-primary)" : "var(--text-secondary)", letterSpacing: "0.2px", marginBottom: "2px" }}
            onMouseEnter={e => { if (activeNav !== item.id) { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
            onMouseLeave={e => { if (activeNav !== item.id) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-secondary)"; } }}>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 12px 20px" }}>
        {/* Add List */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>New List</p>
          <input type="text" placeholder="List name..." value={newListName} onChange={e => setNewListName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addList(); }}
            style={{ marginBottom: "10px" }} />
          <button onClick={addList}
            style={{ width: "100%", background: "var(--text-primary)", color: "var(--bg-base)", border: "none", borderRadius: "6px", padding: "9px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.8px" }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
            + ADD LIST
          </button>
        </div>

        {/* Unassigned Cards */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Unassigned</p>
            {globalCards.length > 0 && (
              <span style={{ background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "10px", padding: "2px 8px", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>
                {globalCards.length}
              </span>
            )}
          </div>

          <input type="text" placeholder="Card title..." value={globalTitle} onChange={e => setGlobalTitle(e.target.value)}
            style={{ marginBottom: "8px" }} />
          <textarea placeholder="Description (optional)" value={globalDesc} onChange={e => setGlobalDesc(e.target.value)}
            rows="2" style={{ resize: "none", marginBottom: "10px" }} />

          {/* Priority selector */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
            {Object.entries(PRIORITY_COLORS).map(([p, colors]) => (
              <button key={p} onClick={() => setCardPriority(p)}
                style={{ flex: 1, background: cardPriority === p ? colors.bg : "transparent", border: `1px solid ${cardPriority === p ? colors.border : "var(--border)"}`, borderRadius: "5px", padding: "5px", fontSize: "10px", fontWeight: 700, color: cardPriority === p ? colors.color : "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                {p}
              </button>
            ))}
          </div>

          <button onClick={handleAddGlobalCard}
            style={{ width: "100%", background: "transparent", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.5px" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            + CREATE CARD
          </button>

          {/* Global cards list */}
          {globalCards.length > 0 && (
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {globalCards.map(card => {
                const pc = PRIORITY_COLORS[card.priority || "medium"];
                return (
                  <div key={card._id} draggable onDragStart={() => handleDragStart(null, card, true)}
                    style={{ background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 12px", cursor: "grab", position: "relative" }}>
                    <button onClick={() => deleteGlobalCard(card._id)}
                      style={{ position: "absolute", top: "6px", right: "8px", background: "none", border: "none", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1 }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; }}>
                      ×
                    </button>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", paddingRight: "20px", wordBreak: "break-word" }}>{card.title}</p>
                    {card.description && <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>{card.description}</p>}
                    <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", padding: "2px 7px", borderRadius: "3px", background: pc.bg, border: `1px solid ${pc.border}`, color: pc.color, textTransform: "uppercase" }}>
                        {card.priority || "medium"}
                      </span>
                      <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px", padding: "2px 7px", borderRadius: "3px", background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)", textTransform: "uppercase" }}>
                        {card.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
