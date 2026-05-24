import { useEffect, useState } from "react";
import API from "../../api/api";

function MembersPopup({ boardId, setShowMembers }) {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchMembers() {
    try {
      const res = await API.get(`/boards/${boardId}/members`);
      setMembers(res.data);
    } catch (err) { alert(err.response?.data?.message || "Failed to fetch members"); }
  }

  useEffect(() => { fetchMembers(); }, [boardId]);

  async function inviteMember() {
    if (!email.trim()) { alert("Enter email"); return; }
    setLoading(true);
    try {
      await API.post(`/boards/${boardId}/invite`, { email });
      setEmail("");
    } catch (err) { alert(err.response?.data?.message || "Failed to invite member"); }
    finally { setLoading(false); }
  }

  async function removeMember(userId) {
    try {
      await API.delete(`/boards/${boardId}/members/${userId}`);
      fetchMembers();
    } catch (err) { alert(err.response?.data?.message || "Failed to remove member"); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(4px)" }}>
      <div className="animate-fade" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "10px", width: "440px", maxWidth: "90vw", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Board Members</h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{members.length} member{members.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setShowMembers(false)}
            style={{ background: "none", border: "none", fontSize: "20px", color: "var(--text-muted)", lineHeight: 1 }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; }}>
            ×
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <input type="email" placeholder="Invite by email..." value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") inviteMember(); }}
              style={{ flex: 1 }} />
            <button onClick={inviteMember} disabled={loading}
              style={{ background: "var(--text-primary)", color: "var(--bg-base)", border: "none", borderRadius: "6px", padding: "10px 18px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", whiteSpace: "nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
              {loading ? "..." : "INVITE"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "320px", overflowY: "auto" }}>
            {members.map(member => (
              <div key={member._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-base)", border: "1px solid var(--border-bright)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", flexShrink: 0 }}>
                    {member.name ? member.name.slice(0,2).toUpperCase() : "??"}
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{member.name}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{member.email}</p>
                  </div>
                </div>
                <button onClick={() => removeMember(member._id)}
                  style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: "5px", padding: "4px 10px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.5px" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                  REMOVE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembersPopup;
