// ▼ タブを押したときに牌一覧を切り替える
const tabs = document.querySelectorAll(".tab");
const tabContent = document.getElementById("tab-content");
const handAll = document.getElementById("hand-all");
const tsumoTile = document.getElementById("tsumo-tile");
const furoHand = document.getElementById("furo-hand");

// ▼ 入力モード（面前 / 副露）
let mode = "menzen";

// ▼ 牌データ
const tiles = {
  manzu: ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m"],
  pinzu: ["1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p"],
  souzu: ["1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s"],
  jihai: ["東", "南", "西", "北", "白", "發", "中"],
};

// --------------------------------
// ▼ 初期表示（マンズ）
// --------------------------------
loadTiles("manzu");

// ▼ タブ切り替え
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    loadTiles(tab.dataset.tab);
  });
});

// --------------------------------
// ▼ 牌一覧を読み込む
// --------------------------------
function loadTiles(category) {
  tabContent.innerHTML = "";
  tiles[category].forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "tile-btn";
    btn.textContent = t;
    btn.dataset.tile = t;

    btn.addEventListener("click", () => onTileClick(t));
    tabContent.appendChild(btn);
  });
}

// --------------------------------
// ▼ モード切替（面前 / 副露）
// --------------------------------
document.getElementById("mode-menzen").addEventListener("click", () => {
  mode = "menzen";
  switchModeHighlight();
});

document.getElementById("mode-furo").addEventListener("click", () => {
  mode = "furo";
  switchModeHighlight();
});

function switchModeHighlight() {
  document
    .querySelectorAll(".mode-btn")
    .forEach((b) => b.classList.remove("active"));
  if (mode === "menzen") {
    document.getElementById("mode-menzen").classList.add("active");
  } else {
    document.getElementById("mode-furo").classList.add("active");
  }
}

// --------------------------------
// ▼ 牌クリック時の処理
// --------------------------------
function onTileClick(tile) {
  const allTiles = getAllTiles();
  const count = allTiles.filter((t) => t === tile).length;

  if (count >= 4) {
    alert("同じ牌は4枚までです。");
    return;
  }

  if (mode === "menzen") {
    addMenzenTile(tile);
  } else {
    addFuroTile(tile);
  }
}

// --------------------------------
// ▼ 面前追加
// --------------------------------
function addMenzenTile(tile) {
  const current = getAllTiles();
  const total = current.length;

  // 13枚 → ツモへ
  if (total === 13) {
    tsumoTile.innerHTML = "";
    tsumoTile.appendChild(createTileButton(tile, true));
    return;
  }

  // 1〜13枚 → 通常
  if (total < 13) {
    handAll.appendChild(createTileButton(tile, false));
    sortHand();
  }
}

// --------------------------------
// ▼ 副露追加
// --------------------------------
function addFuroTile(tile) {
  const currentFuroCount = Array.from(furoHand.children).length;

  // 副露は最大12枚まで
  if (currentFuroCount >= 12) {
    alert("副露牌は最大12枚までです。");
    return;
  }

  // ▼ 副露牌として追加
  const btn = createTileButton(tile, false);
  furoHand.appendChild(btn);
}

// --------------------------------
// ▼ ボタンを作る
// --------------------------------
function createTileButton(tile, isTsumo) {
  const btn = document.createElement("button");
  btn.className = "tile-btn";
  btn.textContent = tile;

  btn.addEventListener("click", () => {
    if (isTsumo) {
      tsumoTile.innerHTML = "";
    } else {
      // 面前の牌だったら削除後に並び替え
      if (handAll.contains(btn)) {
        handAll.removeChild(btn);
        sortHand();
      }

      // 副露の牌だったら普通に削除
      if (furoHand.contains(btn)) {
        furoHand.removeChild(btn);
      }
    }
  });

  return btn;
}

// --------------------------------
// ▼ 面前牌を並び替え
// --------------------------------
function sortHand() {
  const tiles = Array.from(handAll.children).map((btn) => btn.textContent);

  tiles.sort(sortFunc);

  handAll.innerHTML = "";
  tiles.forEach((t) => {
    handAll.appendChild(createTileButton(t, false));
  });
}

// --------------------------------
// ▼ 並び替えルール
// --------------------------------
const tileOrder = { m: 1, p: 2, s: 3, 字: 4 };
const jihaiOrder = { 東: 1, 南: 2, 西: 3, 北: 4, 白: 5, 發: 6, 中: 7 };

function sortFunc(a, b) {
  const aType = getType(a);
  const bType = getType(b);

  if (tileOrder[aType] !== tileOrder[bType]) {
    return tileOrder[aType] - tileOrder[bType];
  }

  if (aType === "字") {
    return jihaiOrder[a] - jihaiOrder[b];
  }

  return parseInt(a[0]) - parseInt(b[0]);
}

function getType(tile) {
  const last = tile.slice(-1);
  if (last === "m") return "m";
  if (last === "p") return "p";
  if (last === "s") return "s";
  return "字";
}

// --------------------------------
// ▼ 現在の牌を取得
// --------------------------------
function getAllTiles() {
  const normal = Array.from(handAll.children).map((btn) => btn.textContent);
  const tsumo = tsumoTile.children.length
    ? [tsumoTile.children[0].textContent]
    : [];
  const furo = Array.from(furoHand.children).map((btn) => btn.textContent);

  return [...normal, ...tsumo, ...furo];
}
