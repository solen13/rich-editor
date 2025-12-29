<template>
  <div
    class="ve-custom-editor-wrapper"
    :style="{ '--ve-border-color': borderColor }"
    @click="deselectMedia"
  >
    <div class="ve-toolbar">
      <div class="ve-group">
        <button
          @click="execAction('formatBlock', 'H1')"
          :class="{ 've-active': isTag('H1') }"
        >
          H1
        </button>
        <button
          @click="execAction('formatBlock', 'H2')"
          :class="{ 've-active': isTag('H2') }"
        >
          H2
        </button>
        <button
          @click="execAction('formatBlock', 'H3')"
          :class="{ 've-active': isTag('H3') }"
        >
          H3
        </button>
        <button
          @click="execAction('formatBlock', 'P')"
          :class="{ 've-active': isTag('P') }"
        >
          Text
        </button>
      </div>

      <div class="ve-divider"></div>

      <div class="ve-group">
        <select
          @change="execAction('fontName', $event.target.value)"
          class="ve-font-select ve-input"
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Monospace</option>
        </select>
        <select
          @change="execAction('fontSize', $event.target.value)"
          class="ve-size-select ve-input"
        >
          <option value="1">S</option>
          <option value="3" selected>M</option>
          <option value="5">L</option>
          <option value="7">XL</option>
        </select>
      </div>

      <div class="ve-divider"></div>

      <div class="ve-group">
        <button @click="execAction('bold')" title="Kalın"><b>B</b></button>
        <button @click="execAction('italic')" title="İtalik"><i>I</i></button>
        <button @click="execAction('underline')" title="Altı Çizili">
          <u>U</u>
        </button>
        <input
          type="color"
          @input="execAction('foreColor', $event.target.value)"
          class="ve-color-picker"
        />
      </div>

      <div class="ve-divider"></div>

      <div class="ve-group">
        <button @click="addLink">🔗</button>
        <button @click="$refs.fileInput.click()">🖼️</button>
        <button @click="addYoutubeVideo">📺</button>
        <button @click="insertTable">📊</button>
        <input
          type="file"
          ref="fileInput"
          hidden
          accept="image/*"
          @change="handleImageUpload"
        />
      </div>

      <div class="ve-divider"></div>

      <div class="ve-group">
        <button @click="execAction('justifyLeft')">⬅️</button>
        <button @click="execAction('justifyCenter')">⬆️</button>
        <button @click="execAction('justifyRight')">➡️</button>
        <button
          v-if="allowPreview"
          @click="showPreview = true"
          class="ve-preview-btn"
        >
          👁️
        </button>
      </div>
    </div>

    <div class="ve-editor-container">
      <div
        ref="editorRef"
        class="ve-editor-area"
        contenteditable="true"
        @input="updateContent"
        @click="handleEditorClick"
      ></div>

      <div
        v-if="selectedMedia"
        class="ve-resizer-overlay"
        :style="resizerStyle"
      >
        <div
          class="ve-resizer-handle"
          @mousedown.stop.prevent="startResizing"
        ></div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showPreview"
        class="ve-modal-overlay"
        @click.self="showPreview = false"
      >
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
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";
const props = defineProps({
  allowPreview: { type: Boolean, default: true },
});
const emit = defineEmits(["update:modelValue", "change"]);
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
  const url = prompt("Add url", "");
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
  emit("update:modelValue", editorRef.value.innerHTML);
};

onMounted(() => {
  editorRef.value.innerHTML = "";
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
  margin-bottom: 1rem;
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
</style>
