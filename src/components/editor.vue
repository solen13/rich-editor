<template>
  <div class="custom-editor-wrapper" @click="deselectMedia">
    <div class="toolbar">
      <div class="group">
        <button
          @click="execAction('formatBlock', 'H1')"
          :class="{ active: isTag('H1') }"
        >
          H1
        </button>
        <button
          @click="execAction('formatBlock', 'H2')"
          :class="{ active: isTag('H2') }"
        >
          H2
        </button>
        <button
          @click="execAction('formatBlock', 'H3')"
          :class="{ active: isTag('H3') }"
        >
          H3
        </button>
        <button
          @click="execAction('formatBlock', 'P')"
          :class="{ active: isTag('P') }"
        >
          Metin
        </button>
      </div>

      <div class="divider"></div>

      <div class="group">
        <select
          @change="execAction('fontName', $event.target.value)"
          class="font-select"
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Monospace</option>
        </select>
        <select
          @change="execAction('fontSize', $event.target.value)"
          class="size-select"
        >
          <option value="1">S</option>
          <option value="3" selected>M</option>
          <option value="5">L</option>
          <option value="7">XL</option>
        </select>
      </div>

      <div class="divider"></div>

      <div class="group">
        <button @click="execAction('bold')" title="Kalın"><b>B</b></button>
        <button @click="execAction('italic')" title="İtalik"><i>I</i></button>
        <button @click="execAction('underline')" title="Altı Çizili">
          <u>U</u>
        </button>
        <input
          type="color"
          @input="execAction('foreColor', $event.target.value)"
          class="color-picker"
          title="Yazı Rengi"
        />
      </div>

      <div class="divider"></div>

      <div class="group">
        <button @click="addLink" title="Link Ekle">🔗</button>
        <button @click="$refs.fileInput.click()" title="Resim Ekle">🖼️</button>
        <button @click="addYoutubeVideo" title="Youtube Ekle">📺</button>
        <button @click="insertTable" title="Tablo Ekle">📊</button>
        <input
          type="file"
          ref="fileInput"
          hidden
          accept="image/*"
          @change="handleImageUpload"
        />
      </div>

      <div class="divider"></div>

      <div class="group">
        <button @click="execAction('justifyLeft')">⬅️</button>
        <button @click="execAction('justifyCenter')">⬆️</button>
        <button @click="execAction('justifyRight')">➡️</button>
        <button
          @click="showPreview = true"
          class="preview-btn"
          title="Ön İzleme"
        >
          👁️
        </button>
      </div>

      <div class="divider"></div>

      <div class="group">
        <button @click="exportToPDF" class="export-btn pdf" title="PDF İndir">
          📄 PDF
        </button>
        <button
          @click="exportToWord"
          class="export-btn word"
          title="Word İndir"
        >
          📝 DOC
        </button>
      </div>
    </div>

    <div class="editor-container">
      <div
        id="editor-content-area"
        ref="editorRef"
        class="editor-area"
        contenteditable="true"
        @input="updateContent"
        @click="handleEditorClick"
      ></div>

      <div v-if="selectedMedia" class="resizer-overlay" :style="resizerStyle">
        <div
          class="resizer-handle"
          @mousedown.stop.prevent="startResizing"
        ></div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showPreview"
        class="modal-overlay"
        @click.self="showPreview = false"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h3>İçerik Ön İzleme</h3>
            <button @click="showPreview = false" class="close-modal">X</button>
          </div>
          <div class="preview-body" v-html="content"></div>
        </div>
      </div>
    </Teleport>

    <div class="footer">
      <span>Karakter: {{ charCount }}</span>
      <span>Esnek Mod: Aktif (PDF/Word Aktarımı Eklendi)</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const editorRef = ref(null);
const fileInput = ref(null);
const content = ref("");
const charCount = ref(0);
const selectedMedia = ref(null);
const showPreview = ref(false);
const resizerStyle = ref({ top: 0, left: 0, width: 0, height: 0 });

const execAction = (command, value = null) => {
  document.execCommand(command, false, value);
  updateContent();
  editorRef.value.focus();
};

const isTag = (tagName) => {
  if (!editorRef.value) return false;
  return document.queryCommandValue("formatBlock") === tagName.toLowerCase();
};

const exportToPDF = () => {
  const element = document.getElementById("editor-content-area");

  if (window.html2pdf) {
    const opt = {
      margin: 10,
      filename: "belge.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    window.html2pdf().set(opt).from(element).save();
  } else {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = exportToPDF;
    document.head.appendChild(script);
  }
};

const exportToWord = () => {
  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
  const footer = "</body></html>";
  const sourceHTML =
    header + document.getElementById("editor-content-area").innerHTML + footer;

  const source =
    "data:application/vnd.ms-word;charset=utf-8," +
    encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = "belge.doc";
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

const insertTable = () => {
  const rows = prompt("Satır sayısı:", "3");
  const cols = prompt("Sütun sayısı:", "2");
  if (rows && cols) {
    let tableHtml = `<table class="resizable-media" style="width:100%; border-collapse:collapse; margin:10px 0; border:1px solid #ccc; display:inline-table;">`;
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
  }
};

const addYoutubeVideo = () => {
  const url = prompt(
    "Youtube Video URL (örn: https://www.youtube.com/watch?v=dQw4w9WgXcQ):"
  );
  if (url) {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const html = `<iframe src="${embedUrl}" class="resizable-media" style="width:400px; height:225px; display:inline-block;margin:5px;" frameborder="0" allowfullscreen></iframe>&nbsp;`;
    document.execCommand("insertHTML", false, html);
    updateContent();
  }
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const html = `<img src="${ev.target.result}" class="resizable-media" style="width:250px; display:inline-block; margin:5px;" />&nbsp;`;
      document.execCommand("insertHTML", false, html);
      updateContent();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }
};

const addLink = () => {
  const url = prompt("URL giriniz:", "https://");
  if (url) execAction("createLink", url);
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
};

onMounted(() => {
  editorRef.value.innerHTML = "";
});
</script>

<style scoped>
/* Mevcut stiller korunuyor */
.custom-editor-wrapper {
  border: 2px solid #2c3e50;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  font-family: "Segoe UI", sans-serif;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 2px solid #eee;
  align-items: center;
}
.group {
  display: flex;
  gap: 5px;
  align-items: center;
}
.toolbar button {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 600;
  transition: 0.2s;
}
.toolbar button:hover {
  background: #e9ecef;
}
.preview-btn {
  background: #27ae60 !important;
  color: white !important;
  border: none !important;
}

/* YENİ: Dışa Aktar Buton Stilleri */
.export-btn.pdf {
  background: #e74c3c !important;
  color: white !important;
  border: none !important;
}
.export-btn.word {
  background: #2980b9 !important;
  color: white !important;
  border: none !important;
}

.toolbar button.active {
  background: #3498db;
  color: white;
  border-color: #2980b9;
}
.font-select,
.size-select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.color-picker {
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  cursor: pointer;
}
.divider {
  width: 1px;
  height: 30px;
  background: #ddd;
}
.editor-container {
  position: relative;
}
.editor-area {
  min-height: 400px;
  padding: 30px;
  outline: none;
  line-height: 1.6;
  font-size: 16px;
}

/* Resizer ve Medya Stilleri (Mevcut olanlarla aynı) */
:deep(.resizable-media) {
  cursor: pointer;
  margin: 10px 5px;
  display: inline-block;
  vertical-align: top;
  border: 2px solid transparent;
}
:deep(table.resizable-media) {
  border-collapse: collapse;
}
:deep(.resizable-media:hover) {
  border-color: #3498db;
}
.resizer-overlay {
  position: absolute;
  pointer-events: none;
  border: 2px solid #3498db;
  z-index: 10;
}
.resizer-handle {
  position: absolute;
  width: 15px;
  height: 15px;
  background: #3498db;
  right: -7px;
  bottom: -7px;
  cursor: nwse-resize;
  pointer-events: auto;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

/* Modal Stilleri (Mevcut olanlarla aynı) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: #fff;
  width: 85%;
  max-height: 85%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-header {
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.preview-body {
  padding: 30px;
  overflow-y: auto;
  flex-grow: 1;
}
.close-modal {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background: #2c3e50;
  color: #ecf0f1;
  font-size: 12px;
}
</style>
