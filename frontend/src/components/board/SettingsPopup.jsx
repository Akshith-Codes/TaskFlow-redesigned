import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

function SettingsPopup({ board, boardId, setShowSettings, fetchBoardData }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(board?.title || "");
  const [backgroundColor, setBackgroundColor] = useState(board?.backgroundColor || "#111111");
  const [loading, setLoading] = useState(false);

  async function updateSettings() {
    setLoading(true);
    try {
      await API.put(`/boards/${boardId}`, { title, backgroundColor });
      fetchBoardData();
      setShowSettings(false);
    } catch (err) { alert(err.response?.data?.message || "Failed to update board"); }
    finally { setLoading(false); }
  }

  async function leaveBoard() {
    if (!confirm("Leave this board?")) return;
    try {
      await API.post(`/boards/${boardId}/leave`);
      navigate("/dashboard");
    } catch (err) { alert(err.response?.data?.message || "Failed to leave board"); }
  }

  async function deleteBoard() {
    if (!confirm("Permanently delete this board?")) return;
    try {
      await API.delete(`/boards/${boardId}`);
      navigate("/dashboard");
    } catch (err) { alert(err.response?.data?.message || "Failed to delete board"); }
  }

  const PRESET_COLORS = ["#0a0a0a","#0f1117","#111827","#0d1b2a","#1a1a2e","#16213e","#1a2a1a","#2a1a1a","#1f1f1f","#0a1628"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(4px)" }}>
      <div className="animate-fade" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "10px", width: "440px", maxWidth: "90vw", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Board Settings</h2>
          <button onClick={() => setShowSettings(false)}
            style={{ background: "none", border: "none", fontSize: "20px", color: "var(--text-muted)", lineHeight: 1 }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; }}>
            ×
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Board Name</label>
            <input value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Board Color</label>
            {/* Preset swatches */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => setBackgroundColor(c)}
                  style={{ width: "28px", height: "28px", borderRadius: "6px", background: c, border: backgroundColor === c ? "2px solid var(--text-primary)" : "2px solid var(--border)", cursor: "pointer", transition: "transform 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }} />
              ))}
            </div>
            {/* Color picker */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)}
                style={{ width: "48px", height: "36px", padding: "2px", cursor: "pointer", borderRadius: "6px" }} />
              <input value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)}
                style={{ flex: 1, fontFamily: "'Space Mono', monospace", fontSize: "13px" }} />
            </div>
          </div>

          <button onClick={updateSettings} disabled={loading}
            style={{ width: "100%", background: "var(--text-primary)", color: "var(--bg-base)", border: "none", borderRadius: "6px", padding: "11px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
            {loading ? "SAVING..." : "SAVE CHANGES"}
          </button>

          <button onClick={leaveBoard}
            style={{ width: "100%", background: "transparent", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "8px" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--yellow)"; e.currentTarget.style.color = "var(--yellow)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            LEAVE BOARD
          </button>

          <button onClick={deleteBoard}
            style={{ width: "100%", background: "transparent", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.5px" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            DELETE BOARD
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPopup;
