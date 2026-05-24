function BoardNavbar({ searchText, setSearchText, activities, showActivities, setShowActivities, navigate }) {
  return (
    <header style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", padding: "0 24px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
      <div style={{ position: "relative", width: "300px" }}>
        <input type="text" placeholder="Search cards, lists..." value={searchText} onChange={e => setSearchText(e.target.value)}
          style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "7px 14px 7px 36px", fontSize: "13px", color: "var(--text-primary)" }} />
        <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "var(--text-muted)", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--green)", fontWeight: 600 }}>
          <div className="pulse-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)" }} />
          LIVE
        </div>

        <div style={{ width: "1px", height: "20px", background: "var(--border)" }} />

        <button onClick={() => setShowActivities(!showActivities)}
          style={{ position: "relative", background: showActivities ? "var(--bg-elevated)" : "transparent", border: "1px solid var(--border)", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.5px" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={e => { if (!showActivities) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; } }}>
          ACTIVITY
          {activities.length > 0 && (
            <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "var(--red)", color: "white", fontSize: "10px", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              {activities.length > 9 ? "9+" : activities.length}
            </span>
          )}
        </button>

        <button onClick={() => navigate("/dashboard")}
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
          ← BOARDS
        </button>
      </div>
    </header>
  );
}

export default BoardNavbar;
