import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

const BOARD_COLORS = ["#1a1a1a","#1a1a2e","#1a2a1a","#2a1a1a","#1a2020","#20151a"];

function Dashboard() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [invites, setInvites] = useState([]);
  const [boardName, setBoardName] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function fetchBoards() {
    try {
      const res = await API.get("/boards");
      setBoards(res.data);
    } catch (err) { console.error(err); }
  }

  async function fetchInvites() {
    try {
      const res = await API.get("/boards/invites/me");
      setInvites(res.data);
    } catch (err) { console.log("No invites"); }
  }

  useEffect(() => {
    Promise.all([fetchBoards(), fetchInvites()]).finally(() => setLoading(false));
  }, []);

  async function acceptInvite(boardId) {
    try {
      await API.post(`/boards/${boardId}/accept`);
      fetchBoards(); fetchInvites();
    } catch (err) { alert(err.response?.data?.message || "Failed to accept invite"); }
  }

  async function createBoard(e) {
    e.preventDefault();
    if (!boardName.trim()) return;
    try {
      await API.post("/boards", { title: boardName, backgroundColor: "#111111" });
      setBoardName("");
      fetchBoards();
    } catch (err) { alert(err.response?.data?.message || "Failed to create board"); }
  }

  async function deleteBoard(id, isDefault) {
    if (isDefault) { alert("Default boards cannot be deleted"); return; }
    try {
      await API.delete(`/boards/${id}`);
      fetchBoards();
    } catch (err) { alert(err.response?.data?.message || "Failed to delete board"); }
  }

  async function logout() {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) { alert("Logout failed"); }
  }

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "TF";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Navbar */}
      <header style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "0 32px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <h1 className="mono" style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>TaskFlow</h1>
          <div style={{ width: "1px", height: "20px", background: "var(--border)" }} />
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Dashboard</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-bright)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.5px" }}>
              {initials}
            </div>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{user?.name || "User"}</span>
          </div>
          <button onClick={logout}
            style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            LOGOUT
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "3px", marginBottom: "8px" }}>WORKSPACE</div>
          <h2 style={{ fontSize: "36px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-1px" }}>My Boards</h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "6px" }}>
            {boards.length} board{boards.length !== 1 ? "s" : ""} · Manage your project workspaces
          </p>
        </div>

        {/* Invites */}
        {invites.length > 0 && (
          <div className="animate-fade" style={{ background: "var(--bg-surface)", border: "1px solid rgba(85,153,255,0.3)", borderRadius: "8px", padding: "24px", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--blue)" }} />
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "1px", textTransform: "uppercase" }}>Pending Invites ({invites.length})</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {invites.map(board => (
                <div key={board._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "14px 16px" }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{board.title}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Invited by {board.owner?.name}</p>
                  </div>
                  <button onClick={() => acceptInvite(board._id)}
                    style={{ background: "transparent", border: "1px solid var(--green)", color: "var(--green)", borderRadius: "6px", padding: "6px 16px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(68,221,136,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    ACCEPT
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Board */}
        <form onSubmit={createBoard} style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
          <input type="text" placeholder="New board name..." value={boardName} onChange={e => setBoardName(e.target.value)}
            style={{ flex: 1, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "6px", padding: "12px 16px", fontSize: "14px", color: "var(--text-primary)" }} />
          <button type="submit"
            style={{ background: "var(--text-primary)", color: "var(--bg-base)", border: "none", borderRadius: "6px", padding: "12px 24px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
            + NEW BOARD
          </button>
        </form>

        {/* Board Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "8px", height: "140px", opacity: 0.5 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
            {boards.map((board, idx) => (
              <div key={board._id} className="animate-fade"
                style={{ background: board.backgroundColor || BOARD_COLORS[idx % BOARD_COLORS.length], border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", position: "relative", overflow: "hidden", transition: "border-color 0.15s, transform 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                {/* Decorative corner */}
                <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "60px", borderBottom: "1px solid rgba(255,255,255,0.05)", borderLeft: "1px solid rgba(255,255,255,0.05)", borderBottomLeftRadius: "8px" }} />

                {board.isDefault && (
                  <div className="mono" style={{ fontSize: "9px", color: "var(--green)", letterSpacing: "2px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--green)" }} /> DEFAULT
                  </div>
                )}

                <Link to={`/board/${board._id}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.3px", lineHeight: 1.3, marginBottom: "8px" }}>
                    {board.title}
                  </h3>
                </Link>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Project workspace</p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <Link to={`/board/${board._id}`}
                    style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.5px" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; }}>
                    OPEN →
                  </Link>
                  {!board.isDefault && (
                    <button onClick={() => deleteBoard(board._id, board.isDefault)}
                      style={{ background: "none", border: "none", fontSize: "12px", color: "var(--text-muted)", padding: "2px 6px" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; }}>
                      DELETE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
