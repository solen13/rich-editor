<template>
  <div class="ve-custom-editor-wrapper" :style="{ '--ve-border-color': borderColor }" @click="deselectMedia"
    @keydown.enter="handleEnter" @mouseup="updateButtonStates" @keyup="updateButtonStates" @input="updateContent">
    <div class="ve-toolbar">
      <div class="ve-group">
        <button @click="execAction('formatBlock', 'H1')" :class="{ 've-active': activeStates.H1 }">
          H1
        </button>
        <button @click="execAction('formatBlock', 'H2')" :class="{ 've-active': activeStates.H2 }">
          H2
        </button>
        <button @click="execAction('formatBlock', 'H3')" :class="{ 've-active': activeStates.H3 }">
          H3
        </button>
        <button @click="execAction('formatBlock', 'P')" :class="{ 've-active': activeStates.P }">
          Text
        </button>
      </div>
      <div class="ve-divider"></div>

      <div class="ve-group">
        <button @click="execAction('insertUnorderedList')" title="Noktalı Liste"
          :class="{ 've-active': activeStates.ul }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="9" y1="6" x2="20" y2="6"></line>
            <line x1="9" y1="12" x2="20" y2="12"></line>
            <line x1="9" y1="18" x2="20" y2="18"></line>
            <circle cx="4" cy="6" r="1.5" fill="currentColor"></circle>
            <circle cx="4" cy="12" r="1.5" fill="currentColor"></circle>
            <circle cx="4" cy="18" r="1.5" fill="currentColor"></circle>
          </svg>
        </button>
        <button @click="execAction('insertOrderedList')" title="Numaralı Liste"
          :class="{ 've-active': activeStates.ol }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>
      </div>
      <div class="ve-divider"></div>

      <div class="ve-group">
        <select @change="execAction('fontName', $event.target.value)" class="ve-font-select ve-input">
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Monospace</option>
        </select>
        <select @change="execAction('fontSize', $event.target.value)" class="ve-size-select ve-input">
          <option value="1">S</option>
          <option value="3" selected>M</option>
          <option value="5">L</option>
          <option value="7">XL</option>
        </select>
      </div>

      <div class="ve-divider"></div>

      <div class="ve-group">
        <button @click="execAction('bold')" title="Kalın" :class="{ 've-active': activeStates.bold }">
          <b>B</b>
        </button>
        <button @click="execAction('italic')" :class="{ 've-active': activeStates.italic }" title="İtalik">
          <i>I</i>
        </button>
        <button @click="execAction('underline')" :class="{ 've-active': activeStates.underline }" title="Altı Çizili">
          <u>U</u>
        </button>
        <button @click="execAction('strikeThrough')" :class="{ 've-active': activeStates.strikeThrough }"
          title="Üstü Çizili">
          <span style="text-decoration: line-through;">S</span>
        </button>
        <div class="ve-group" style="position: relative;">
          <button type="button" @click.stop="showHighlightPicker = !showHighlightPicker">
            🖍️
          </button>

          <div v-if="showHighlightPicker" class="ve-highlight-dropdown">
            <div v-for="color in highlightColors" :key="color" @mousedown.prevent="applyHighlight(color)"
              class="ve-color-circle" :style="{ backgroundColor: color === 'transparent' ? 'white' : color }">
              <span v-if="color === 'transparent'" style="color:red; font-weight:bold;">X</span>
            </div>
          </div>
        </div>
        <input type="color" @input="execAction('foreColor', $event.target.value)" class="ve-color-picker" />
      </div>

      <div class="ve-divider"></div>

      <div class="ve-group">
        <button @click="openModal('link')">🔗</button>
        <button @click="$refs.fileInput.click()">🖼️</button>
        <button @click="openModal('video')">📺</button>
        <button @click="openModal('table')">📊</button>
        <input type="file" ref="fileInput" hidden accept="image/*" @change="handleImageUpload" />
      </div>

      <div class="ve-divider"></div>

      <div class="ve-group">
        <button @click="execAction('justifyLeft')" :class="{ 've-active': activeStates.alignLeft }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="17" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="17" y1="18" x2="3" y2="18"></line>
          </svg>
        </button>
        <button @click="execAction('justifyCenter')" :class="{ 've-active': activeStates.alignCenter }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="10" x2="6" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="18" y1="18" x2="6" y2="18"></line>
          </svg>
        </button>
        <button @click="execAction('justifyRight')" :class="{ 've-active': activeStates.alignRight }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="21" y1="10" x2="7" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="7" y2="18"></line>
          </svg>
        </button>
        <button v-if="allowPreview" @click="showPreview = true" class="ve-preview-btn">
          👁️
        </button>
      </div>
    </div>

    <div class="ve-editor-container">
      <div ref="editorRef" class="ve-editor-area" contenteditable="true" @input="updateContent"
        @click="handleEditorClick"></div>

      <div v-if="selectedMedia" class="ve-resizer-overlay" :style="resizerStyle">
        <div class="ve-resizer-handle" @mousedown.stop.prevent="startResizing"></div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showPreview" class="ve-modal-overlay" @click.self="showPreview = false">
        <div class="ve-modal-content">
          <div class="ve-modal-header">
            <h3>Preview</h3>
            <button @click="showPreview = false" class="ve-close-modal">
              X
            </button>
          </div>
          <div class="ve-preview-body" v-html="content"></div>
        </div>
      </div>
    </Teleport>
    <Teleport to="body">
      <div v-if="showInputModal" class="ve-modal-overlay" @click.self="showInputModal = false">
        <div class="ve-modal-content ve-small-modal">
          <div class="ve-modal-header">
            <h3 v-if="modalType === 'link'">Link Add</h3>
            <h3 v-if="modalType === 'video'">YouTube Video Add</h3>
            <h3 v-if="modalType === 'table'">Table Create</h3>
            <button @click="showInputModal = false" class="ve-close-modal">X</button>
          </div>
          <div class="ve-modal-body">
            <div v-if="modalType === 'link' || modalType === 'video'">
              <label>URL Address:</label>
              <input v-model="modalData.url" type="text" class="ve-main-input" placeholder="https://..."
                @keyup.enter="handleModalConfirm">
            </div>

            <div v-if="modalType === 'table'" class="ve-table-inputs">
              <div>
                <label>Rows:</label>
                <input v-model.number="modalData.rows" type="number" class="ve-main-input">
              </div>
              <div>
                <label>Cols:</label>
                <input v-model.number="modalData.cols" type="number" class="ve-main-input">
              </div>
            </div>

            <div class="ve-modal-footer">
              <button @click="handleModalConfirm" class="ve-confirm-btn">Add</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {ref, onMounted, defineEmits} from "vue";
const props = defineProps({
  allowPreview: {type: Boolean, default: true},
});
const emit = defineEmits(["update:modelValue", "change"]);
const editorRef = ref(null);
const fileInput = ref(null);
const content = ref("");
const charCount = ref(0);
const selectedMedia = ref(null);
const showPreview = ref(false);
const resizerStyle = ref({top: 0, left: 0, width: 0, height: 0});

const activeStates = ref({
  H1: false,
  H2: false,
  H3: false,
  P: false,
  bold: false,
  italic: false,
  underline: false,
  ul: false,
  ol: false,
  alignLeft: false,
  alignCenter: false,
  alignRight: false,
  strikeThrough: false,
});
const showHighlightPicker = ref(false);
const showInputModal = ref(false);
const modalType = ref(''); // 'link', 'video', 'table'
const modalData = ref({
  url: '',
  rows: 3,
  cols: 3
});
const openModal = (type) => {
  modalType.value = type;
  modalData.value = {url: '', rows: 3, cols: 3}; // Reset
  showInputModal.value = true;
};
const highlightColors = [
  '#ffff00', // Sarı
  '#a2ff00', // fıstık yeşili
  '#00ffff', // Turkuaz
  '#ffadd6', // Pembe
  '#ff5e5e', // Kırmızımsı
  '#ffa500', // Turuncu
  '#d1d1d1', // Gri
  'transparent' // Renk silme (X)
];

const applyHighlight = (color) => {
  if (!editorRef.value) return;

  const selection = window.getSelection();
  if (!selection.rangeCount || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);

  // 1. Manuel olarak bir SPAN oluştur ve boya
  const span = document.createElement("span");
  span.style.backgroundColor = color;

  // Eğer renk 'transparent' ise boyayı kaldırıyoruz demektir
  if (color === 'transparent') {
    span.style.backgroundColor = 'transparent';
  }

  // 2. Seçili metni bu span içine taşı
  try {
    range.surroundContents(span);
  } catch (e) {
    // Eğer karmaşık bir seçim varsa (başlık + paragraf gibi) standart yönteme dön
    document.execCommand('hiliteColor', false, color);
  }

  // 3. KESİN ÇÖZÜM: Span'ın dışına çık ve stili sıfırla
  const afterSpan = document.createTextNode('\u200B'); // Görünmez boşluk
  span.after(afterSpan);

  // 4. İmleci bu boşluğun sonuna taşı
  const newRange = document.createRange();
  newRange.setStartAfter(afterSpan);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  // 5. Tarayıcıya "Artık boyama bitti" diye bağır :)
  document.execCommand('hiliteColor', false, 'transparent');
  document.execCommand('removeFormat', false, null);

  showHighlightPicker.value = false;
  updateContent();
};
// Durumları Güncelleyen Fonksiyon (Mavi renkleri bu ayarlar)
const updateButtonStates = () => {
  if (typeof window === "undefined" || !editorRef.value) return;

  // 1. İmlecin olduğu yerdeki ana elemanı bul (H1 mi, P mi?)
  const selection = window.getSelection();
  let parentTag = "";

  if (selection.rangeCount > 0) {
    let node = selection.getRangeAt(0).startContainer;
    // Yazı düğümündeysek (Text Node), bir üstteki gerçek etikete (element) çık
    node = node.nodeType === 3 ? node.parentNode : node;
    // Editörün dışına çıkmadan en yakın blok etiketini bul
    const closestBlock = node.closest("h1, h2, h3, p, div, li");
    parentTag = closestBlock ? closestBlock.tagName.toUpperCase() : "";
  }


  // 2. Butonları bu etikete göre yak (Aktif/Pasif yap)
  activeStates.value.H1 = parentTag === "H1";
  activeStates.value.H2 = parentTag === "H2";
  activeStates.value.H3 = parentTag === "H3";

  // Eğer H1, H2 veya H3 değilse, "Text" (P) butonu yansın
  activeStates.value.P =
    parentTag === "P" ||
    parentTag === "DIV" ||
    parentTag === "" ||
    parentTag === "LI";

  // activeStates.value.alignLeft = textAlign === "justifyLeft";
  // activeStates.value.alignCenter = textAlign === "justifyCenter";
  // activeStates.value.alignRight = textAlign === "justifyRight";
  activeStates.value.strikeThrough = document.queryCommandState("strikeThrough");

  activeStates.value.alignLeft = document.queryCommandState("justifyLeft");
  activeStates.value.alignCenter = document.queryCommandState("justifyCenter");
  activeStates.value.alignRight = document.queryCommandState("justifyRight");

  // 3. Bold, Italic gibi stiller için tarayıcı kontrolü hala en iyisi
  activeStates.value.bold = document.queryCommandState("bold");
  activeStates.value.italic = document.queryCommandState("italic");
  activeStates.value.underline = document.queryCommandState("underline");
  activeStates.value.ul = document.queryCommandState("insertUnorderedList");
  activeStates.value.ol = document.queryCommandState("insertOrderedList");

};

const execAction = (command, value = null) => {
  if (typeof window === "undefined" || !editorRef.value) return;
  editorRef.value.focus();
  const isAlignment = command.startsWith("justify");
  if (command === "formatBlock") {
    const currentBlock = document.queryCommandValue("formatBlock");

    // 1. Eğer zaten o başlıktaysa, P yaparak iptal et (Toggle)
    if (currentBlock === value.toLowerCase()) {
      document.execCommand(command, false, "<P>");
    } else {
      if (document.queryCommandState("insertUnorderedList")) {
        document.execCommand("insertUnorderedList", false, null);
      }
      if (document.queryCommandState("insertOrderedList")) {
        document.execCommand("insertOrderedList", false, null);
      }

      document.execCommand(command, false, `<${value}>`);
    }

  } else {
    if (isAlignment) {
      fixListAlignment();
    }
    document.execCommand(command, false, value);
  }

  if (isAlignment && selectedMedia.value) {
    const el = selectedMedia.value;


    el.style.verticalAlign = "top";

    if (command === "justifyCenter") {
      el.style.float = "none";
      el.style.display = "inline-block";
      el.style.margin = "10px auto";

    } else if (command === "justifyLeft") {
      el.style.display = "inline-block";
      el.style.float = "left";
      el.style.margin = "0 20px 10px 0";
    } else if (command === "justifyRight") {
      el.style.display = "inline-block";
      el.style.float = "right";
      el.style.margin = "0 0 10px 20px";
    }
  }

  updateContent();
  updateButtonStates();
};


const fixListAlignment = () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    let node = selection.getRangeAt(0).startContainer;
    node = node.nodeType === 3 ? node.parentNode : node;

    // İmlecin olduğu yerdeki LI veya UL/OL elemanını bul
    const listItem = node.closest("li");
    const listParent = node.closest("ul, ol");

    if (listItem) {
      // Sadece o satırı düzelt
      listItem.style.listStylePosition = "inside";
    }

    if (listParent && !listItem) {
      // Eğer tüm liste seçiliyse tüm alt elemanları düzelt
      listParent.querySelectorAll("li").forEach((li) => {
        li.style.listStylePosition = "inside";
      });
    }
  }
};

const handleModalConfirm = () => {
  if (modalType.value === 'link') {
    if (modalData.value.url) execAction('createLink', modalData.value.url);
  }
  else if (modalType.value === 'video') {
    insertYoutubeFromUrl(modalData.value.url);
  }
  else if (modalType.value === 'table') {
    generateTable(modalData.value.rows, modalData.value.cols);
  }
  showInputModal.value = false;
};

const insertYoutubeFromUrl = (url) => {
  if (!url) return;

  // YouTube ID'sini ayıklamak için geliştirilmiş Regex
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;

  if (videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const html = `
      <iframe 
        src="${embedUrl}" 
        class="resizable-media" 
        style="width:480px; height:270px; display:inline-block; margin:5px;" 
        frameborder="0" 
        allowfullscreen
      ></iframe>&nbsp;`;

    editorRef.value.focus(); // Editöre odaklanmayı garanti et
    document.execCommand("insertHTML", false, html);
    updateContent();
  } else {
    alert("Geçersiz YouTube URL'si!");
  }
};
const generateTable = (rows, cols) => {
  let tableHtml = `<table class="resizable-media" style="width:100%; border-collapse:collapse; margin:10px 0; border:1px solid #ccc; display:inline-table; vertical-align:top;">`;
  for (let i = 0; i < rows; i++) {
    tableHtml += "<tr>";
    for (let j = 0; j < cols; j++) {
      tableHtml += `<td style="border:1px solid #ccc; padding:8px; min-width:50px;">Hücre</td>`;
    }
    tableHtml += "</tr>";
  }
  tableHtml += "</table><p>&nbsp;</p>";
  document.execCommand("insertHTML", false, tableHtml);
  updateContent();
};
const handleEnter = () => {
  setTimeout(() => {
    updateButtonStates();
    updateContent();
  }, 10);
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const html = `<img src="${ev.target.result}" class="resizable-media" style="width:250px; display:inline-block; margin:5px; float:left;" />&nbsp;`;
      document.execCommand("insertHTML", false, html);
      updateContent();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }
};

const handleEditorClick = (e) => {
  const target =
    e.target.closest(".resizable-media") ||
    (e.target.tagName === "IMG" ||
      e.target.tagName === "IFRAME" ||
      e.target.tagName === "TABLE"
      ? e.target
      : null);
  if (
    target &&
    (target.classList.contains("resizable-media") ||
      target.tagName === "IMG" ||
      target.tagName === "IFRAME" ||
      target.tagName === "TABLE")
  ) {
    selectedMedia.value = target;
    updateResizerPosition();
  } else {
    selectedMedia.value = null;
  }
};

const updateResizerPosition = () => {
  if (!selectedMedia.value) return;
  const rect = selectedMedia.value.getBoundingClientRect();
  const containerRect = editorRef.value.getBoundingClientRect();
  resizerStyle.value = {
    top: rect.top - containerRect.top + editorRef.value.scrollTop + "px",
    left: rect.left - containerRect.left + "px",
    width: rect.width + "px",
    height: rect.height + "px",
  };
};

const startResizing = (e) => {
  const startX = e.clientX;
  const startWidth = selectedMedia.value.clientWidth;
  const ratio = selectedMedia.value.clientHeight / startWidth;
  const onMouseMove = (mE) => {
    const newWidth = startWidth + (mE.clientX - startX);
    selectedMedia.value.style.width = newWidth + "px";
    if (selectedMedia.value.tagName === "IFRAME") {
      selectedMedia.value.style.height = newWidth * ratio + "px";
    } else {
      selectedMedia.value.style.height = "auto";
    }
    updateResizerPosition();
  };
  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    updateContent();
  };
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const deselectMedia = (e) => {
  if (
    !e.target.closest(".resizable-media") &&
    !e.target.classList.contains("resizer-handle")
  ) {
    selectedMedia.value = null;
  }
};

const updateContent = () => {
  if (editorRef.value) {
    content.value = editorRef.value.innerHTML;
    charCount.value = editorRef.value.innerText.length;
  }
  emit("update:modelValue", editorRef.value.innerHTML);
};

onMounted(() => {
  if (editorRef.value && editorRef.value.innerHTML === "") {
    editorRef.value.innerHTML = "<p><br></p>"; // Boş başlamasın, bir p ile başlasın
  }
  if (typeof document !== "undefined") {
    // Enter'a basınca her zaman <p> oluşturmasını zorla
    document.execCommand("defaultParagraphSeparator", false, "p");
  }
});
</script>

<style>
.ve-custom-editor-wrapper {
  border: 2px solid var(--ve-border-color, #2c3e50);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  font-family: "Segoe UI", sans-serif;
  box-sizing: border-box;
}

.ve-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 2px solid #eee;
  align-items: center;
}

.ve-group {
  display: flex;
  gap: 5px;
  align-items: center;
}

.ve-toolbar button {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 600;
  transition: 0.2s;
}

.ve-toolbar button.ve-active {
  background: #3498db;
  color: white;
  border-color: #2980b9;
}

.ve-preview-btn {
  background: #27ae60 !important;
  color: white !important;
  border: none !important;
}

.ve-divider {
  width: 1px;
  height: 30px;
  background: #ddd;
}

.ve-editor-container {
  position: relative;
  width: 100%;
}

.ve-editor-area {
  min-height: 400px;
  padding: 30px;
  outline: none;
  line-height: 1.6;
  font-size: 16px;
  background: white;
  color: #333;
  word-wrap: break-word;
}

.ve-editor-area :deep(h1) {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.ve-editor-area :deep(h2) {
  font-size: 1.8rem;
  font-weight: 700;
}

.ve-editor-area :deep(p) {
  margin-top: 0;
  margin-bottom: 12px;
  line-height: 1.6;

}

.ve-editor-area :deep(p:last-child) {
  margin-bottom: 0;
}

.ve-editor-area :deep(.resizable-media) {
  cursor: pointer;
  margin: 10px 5px;
  display: inline-block;
  border: 2px solid transparent;
}

.ve-resizer-overlay {
  position: absolute;
  pointer-events: none;
  border: 2px solid #3498db;
  z-index: 10;
}

.ve-resizer-handle {
  position: absolute;
  width: 15px;
  height: 15px;
  background: #3498db;
  right: -7px;
  bottom: -7px;
  cursor: nwse-resize;
  pointer-events: auto;
  border-radius: 50%;
}

.ve-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.ve-modal-content {
  background: #fff;
  width: 85%;
  max-height: 85%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.ve-modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

.ve-preview-body {
  padding: 30px;
  overflow-y: auto;
  flex-grow: 1;
}

.ve-input {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.ve-editor-area :deep(ul) {
  list-style-type: disc !important;
  margin-left: 25px !important;
}

.ve-editor-area :deep(ol) {
  list-style-type: decimal !important;
  margin-left: 25px !important;
}

.ve-editor-area :deep(ul),
.ve-editor-area :deep(ol) {
  list-style-position: inside !important;
  /* Noktayı içeri alır */
  padding-left: 0 !important;
  margin-left: 0 !important;
  list-style-type: inherit;
}

.ve-editor-area :deep(li) {
  /* li elemanının içindeki metnin hizalanmasını sağlar */
  text-align: inherit;
  display: list-item;
  /* Liste özelliğini koru */
}

.ve-editor-area :deep(li)::marker {
  text-align: unset !important;
}

.ve-toolbar button.ve-active {
  background: #3498db !important;
  /* Mavi renk */
  color: white !important;
  border-color: #2980b9 !important;
}

.ve-highlight-dropdown {
  position: absolute;
  top: 40px;
  /* Butonun hemen altı */
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  /* En üstte görünsün */
  min-width: 140px;
}

.ve-color-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ve-small-modal {
  max-width: 400px;
  width: 90% !important;
  height: auto !important;
}

.ve-modal-body {
  padding: 20px;
}

.ve-main-input {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.ve-table-inputs {
  display: flex;
  gap: 15px;
}

.ve-modal-footer {
  margin-top: 20px;
  text-align: right;
}

.ve-confirm-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.ve-confirm-btn:hover {
  background: #2980b9;
}

.ve-close-modal {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
}
</style>
