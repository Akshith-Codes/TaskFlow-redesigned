import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import MembersPopup from "../components/board/MembersPopup";
import Sidebar from "../components/board/Sidebar";
import BoardNavbar from "../components/board/BoardNavbar";
import ActivityPopup from "../components/board/ActivityPopup";
import SettingsPopup from "../components/board/SettingsPopup";
import ListColumn from "../components/board/ListColumn";

function BoardPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [activities, setActivities] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [globalTitle, setGlobalTitle] = useState("");
  const [globalDesc, setGlobalDesc] = useState("");
  const [showActivities, setShowActivities] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [focusMode, setFocusMode] = useState(false);

  async function fetchBoardData() {
    try {
      const boardRes = await API.get(`/boards/${id}`);
      const listsRes = await API.get(`/lists/${id}`);
      const cardsRes = await API.get(`/cards/board/${id}`);
      setBoard(boardRes.data);
      setCards(cardsRes.data);
      const mergedLists = listsRes.data.map(list => ({
        ...list, id: list._id,
        cards: cardsRes.data.filter(card => card.listId === list._id),
        inputTitle: "", inputDesc: "",
      }));
      setLists(mergedLists);
      try {
        const activityRes = await API.get(`/activity/${id}`);
        setActivities(activityRes.data);
      } catch { setActivities([]); }
    } catch (err) { alert(err.response?.data?.message || "Failed to load board"); }
  }

  useEffect(() => { fetchBoardData(); }, [id]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "/") {
        e.preventDefault();
        document.querySelector("input[placeholder='Search cards, lists...']")?.focus();
      }
      if (e.key === "Escape") {
        setShowMembers(false);
        setShowSettings(false);
        setShowActivities(false);
      }
      if (e.key === "m" || e.key === "M") setShowMembers(prev => !prev);
      if (e.key === "a" || e.key === "A") setShowActivities(prev => !prev);
      if (e.key === "f" || e.key === "F") setFocusMode(prev => !prev);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  async function addList() {
    if (!newListName.trim()) return;
    try {
      await API.post("/lists", { title: newListName, boardId: id });
      setNewListName(""); fetchBoardData();
    } catch (err) { alert(err.response?.data?.message || "Failed to create list"); }
  }

  function updateInput(listId, field, value) {
    setLists(prev => prev.map(list => (list._id === listId || list.id === listId) ? { ...list, [field]: value } : list));
  }

  async function addCard(listId, priority = "medium") {
    const list = lists.find(l => l._id === listId || l.id === listId);
    if (!list?.inputTitle?.trim()) return;
    try {
      await API.post("/cards", { title: list.inputTitle, description: list.inputDesc, listId, boardId: id, status: "ongoing", priority });
      fetchBoardData();
    } catch (err) { alert(err.response?.data?.message || "Failed to create card"); }
  }

  async function addGlobalCard(priority = "medium") {
    if (!globalTitle.trim()) return;
    try {
      await API.post("/cards", { title: globalTitle, description: globalDesc, boardId: id, listId: null, status: "ongoing", priority });
      setGlobalTitle(""); setGlobalDesc(""); fetchBoardData();
    } catch (err) { alert(err.response?.data?.message || "Failed to create card"); }
  }

  async function deleteCard(listId, cardId) {
    try { await API.delete(`/cards/${cardId}`); fetchBoardData(); }
    catch (err) { alert(err.response?.data?.message || "Failed to delete card"); }
  }

  async function deleteGlobalCard(cardId) {
    try { await API.delete(`/cards/${cardId}`); fetchBoardData(); }
    catch (err) { alert(err.response?.data?.message || "Failed to delete card"); }
  }

  async function deleteList(listId) {
    const list = lists.find(l => l._id === listId || l.id === listId);
    if (["Today", "This Week", "Later"].includes(list?.title)) { alert("Default lists cannot be deleted"); return; }
    try { await API.delete(`/lists/${listId}`); fetchBoardData(); }
    catch (err) { alert(err.response?.data?.message || "Failed to delete list"); }
  }

  async function changeStatus(listId, cardId) {
    const card = cards.find(c => c._id === cardId || c.id === cardId);
    if (!card) return;
    const nextStatus = card.status === "ongoing" ? "doing" : card.status === "doing" ? "done" : "ongoing";
    try { await API.put(`/cards/${cardId}`, { status: nextStatus }); fetchBoardData(); }
    catch (err) { alert(err.response?.data?.message || "Failed to update status"); }
  }

  function handleDragStart(listId, card, fromGlobal = false) {
    setDraggedCard({ listId, card, fromGlobal });
  }

  async function handleDrop(targetListId) {
    if (!draggedCard) return;
    try {
      await API.put(`/cards/move/${draggedCard.card._id}`, { newListId: targetListId, newOrder: Date.now() });
      setDraggedCard(null); fetchBoardData();
    } catch (err) { alert(err.response?.data?.message || "Failed to move card"); }
  }

  function getCardColor(status) {
    if (status === "ongoing") return "bg-red-50 border-red-200";
    if (status === "doing") return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  }

  function getCircleStyle(status) {
    if (status === "ongoing") return "border-red-400 bg-white";
    if (status === "doing") return "border-yellow-500 border-dashed bg-white";
    return "border-green-500 bg-green-500";
  }

  const totalCards = cards.length;
  const globalCards = cards.filter(card => !card.listId);
  const doneCards = cards.filter(c => c.status === "done").length;

  // Health score
  const overdueCards = cards.filter(c =>
    c.status !== "done" && c.createdAt &&
    (Date.now() - new Date(c.createdAt).getTime()) > 7 * 24 * 60 * 60 * 1000
  ).length;
  const overallProgress = totalCards === 0 ? 0 : Math.round((doneCards / totalCards) * 100);
  const healthScore = totalCards === 0 ? 100 : Math.max(0, Math.min(100, overallProgress - overdueCards * 5));
  const healthLabel = healthScore >= 80 ? "HEALTHY" : healthScore >= 50 ? "FAIR" : "AT RISK";
  const healthColor = healthScore >= 80 ? "#44dd88" : healthScore >= 50 ? "#f0c040" : "#ff4444";

  // Confetti when 100% done
  useEffect(() => {
    if (overallProgress !== 100 || totalCards === 0) return;
    const colors = ["#44dd88", "#f0c040", "#5599ff", "#aa88ff", "#ff4444", "#ffffff"];
    const pieces = [];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.left = Math.random() * 100 + "vw";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = (1.5 + Math.random() * 2) + "s";
      el.style.animationDelay = (Math.random() * 0.8) + "s";
      document.body.appendChild(el);
      pieces.push(el);
    }
    const cleanup = setTimeout(() => pieces.forEach(p => p.remove()), 5000);
    return () => { clearTimeout(cleanup); pieces.forEach(p => p.remove()); };
  }, [overallProgress, totalCards]);

  const filteredLists = lists.map(list => {
    const search = searchText.toLowerCase();
    if (!searchText.trim()) return list;
    const listMatches = list.title.toLowerCase().includes(search);
    const filteredCards = list.cards.filter(card =>
      card.title.toLowerCase().includes(search) || card.description?.toLowerCase().includes(search)
    );
    if (listMatches || filteredCards.length > 0) return { ...list, cards: listMatches ? list.cards : filteredCards };
    return null;
  }).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex" }}>
      {!focusMode && (
        <Sidebar
          newListName={newListName} setNewListName={setNewListName} addList={addList}
          globalTitle={globalTitle} setGlobalTitle={setGlobalTitle}
          globalDesc={globalDesc} setGlobalDesc={setGlobalDesc}
          addGlobalCard={addGlobalCard} globalCards={globalCards} deleteGlobalCard={deleteGlobalCard}
          handleDragStart={handleDragStart} setShowMembers={setShowMembers} setShowSettings={setShowSettings}
        />
      )}

      {showMembers && <MembersPopup boardId={id} setShowMembers={setShowMembers} />}
      {showSettings && <SettingsPopup board={board} boardId={id} setShowSettings={setShowSettings} fetchBoardData={fetchBoardData} />}

      <main style={{ flex: 1, minWidth: 0, position: "relative", backgroundColor: board?.backgroundColor || "var(--bg-base)" }}>
        <BoardNavbar searchText={searchText} setSearchText={setSearchText}
          activities={activities} showActivities={showActivities} setShowActivities={setShowActivities} navigate={navigate} />

        {showActivities && <ActivityPopup activities={activities} setShowActivities={setShowActivities} />}

        <div style={{ padding: "28px 24px" }}>
          {/* Board header */}
          <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                {board?.title || "Workspace Board"}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                {lists.length} lists · {totalCards} cards
              </p>
              {/* Keyboard shortcut hints */}
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px", letterSpacing: "0.3px" }}>
                <span style={{ opacity: 0.6 }}>Shortcuts: </span>
                {[
                  { key: "/", label: "search" },
                  { key: "M", label: "members" },
                  { key: "A", label: "activity" },
                  { key: "F", label: "focus" },
                  { key: "Esc", label: "close" },
                ].map(({ key, label }) => (
                  <span key={key}>
                    <kbd style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "3px", padding: "1px 5px", fontSize: "10px", fontFamily: "monospace" }}>{key}</kbd>
                    {" "}{label}{" "}
                  </span>
                ))}
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  { label: "TOTAL", value: totalCards, color: "var(--text-secondary)" },
                  { label: "DONE", value: doneCards, color: "#44dd88" },
                  { label: "UNASSIGNED", value: globalCards.length, color: "#aa88ff" },
                ].map(stat => (
                  <div key={stat.label} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 16px", textAlign: "center" }}>
                    <p className="mono" style={{ fontSize: "18px", fontWeight: 700, color: stat.color }}>{stat.value}</p>
                    <p style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", marginTop: "2px" }}>{stat.label}</p>
                  </div>
                ))}
                {/* Health score */}
                <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${healthColor}44`, borderRadius: "6px", padding: "8px 16px", textAlign: "center" }}>
                  <p className="mono" style={{ fontSize: "18px", fontWeight: 700, color: healthColor }}>{healthScore}</p>
                  <p style={{ fontSize: "10px", color: healthColor, letterSpacing: "1px", marginTop: "2px" }}>{healthLabel}</p>
                </div>
                {/* Focus mode toggle */}
                <button
                  onClick={() => setFocusMode(prev => !prev)}
                  style={{ background: focusMode ? "rgba(85,153,255,0.15)" : "rgba(0,0,0,0.3)", border: `1px solid ${focusMode ? "var(--blue)" : "var(--border)"}`, borderRadius: "6px", padding: "8px 16px", fontSize: "10px", fontWeight: 700, color: focusMode ? "var(--blue)" : "var(--text-muted)", letterSpacing: "1px" }}>
                  {focusMode ? "⊙ FOCUS ON" : "⊙ FOCUS"}
                </button>
              </div>

              {/* Board-level progress bar */}
              <div style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px" }}>BOARD PROGRESS</span>
                  <span className="mono" style={{ fontSize: "10px", fontWeight: 700, color: totalCards === 0 ? "var(--text-muted)" : doneCards === totalCards ? "#44dd88" : "var(--text-secondary)" }}>
                    {totalCards === 0 ? "—" : `${overallProgress}%`}
                  </span>
                </div>
                <div style={{ height: "4px", background: "rgba(0,0,0,0.3)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: totalCards === 0 ? "0%" : `${overallProgress}%`, background: doneCards === totalCards && totalCards > 0 ? "#44dd88" : overallProgress > 50 ? "#f0c040" : "#ff4444", borderRadius: "2px", transition: "width 0.4s ease" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Lists grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", alignItems: "start" }}>
            {filteredLists.map(list => (
              <ListColumn key={list._id} list={list}
                handleDrop={handleDrop} handleDragStart={handleDragStart}
                changeStatus={changeStatus} deleteCard={deleteCard} deleteList={deleteList}
                updateInput={updateInput} addCard={addCard}
                getCardColor={getCardColor} getCircleStyle={getCircleStyle}
                searchText={searchText} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BoardPage;