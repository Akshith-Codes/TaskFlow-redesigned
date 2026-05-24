function ActivityPopup({ activities, setShowActivities }) {
  return (
    <div style={{ position: "absolute", right: "16px", top: "60px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "8px", width: "360px", zIndex: 50, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} className="animate-fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "1px", textTransform: "uppercase" }}>Activity Log</h2>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{activities.length} events</p>
        </div>
        <button onClick={() => setShowActivities(false)}
          style={{ background: "none", border: "none", fontSize: "18px", color: "var(--text-muted)", lineHeight: 1 }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; }}>
          ×
        </button>
      </div>

      <div style={{ maxHeight: "400px", overflowY: "auto", padding: "12px" }}>
        {activities.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No activity yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {activities.map((activity, idx) => (
              <div key={activity._id} style={{ padding: "12px", borderRadius: "6px", background: idx === 0 ? "var(--bg-elevated)" : "transparent", border: "1px solid transparent", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = idx === 0 ? "var(--bg-elevated)" : "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-muted)", flexShrink: 0, marginTop: "5px" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.4, wordBreak: "break-word" }}>{activity.details}</p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{activity.userId?.name || "Unknown"}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{new Date(activity.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityPopup;
