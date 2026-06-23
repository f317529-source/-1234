const API_URL = "請貼上你的 Apps Script /exec 網址";

const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", () => {
  preview.innerHTML = "";
  const files = imageInput.files;
  if (!files || files.length === 0) {
    preview.className = "preview empty";
    preview.textContent = "尚未選擇圖片";
    return;
  }
  preview.className = "preview";
  [...files].forEach(file => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
  });
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showStatus(text, type) {
  const status = document.getElementById("statusMsg");
  status.className = "status-msg " + type;
  status.textContent = text;
}

async function submitData() {
  const btn = document.getElementById("submitBtn");
  const name = document.getElementById("name").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const note = document.getElementById("note").value.trim();
  const files = [...imageInput.files];

  if (!API_URL || API_URL.includes("請貼上")) {
    showStatus("❌ 請先在 script.js 貼上 Apps Script 網址", "error");
    return;
  }
  if (!name || !amount) {
    showStatus("❌ 請填寫收光人員與光數", "error");
    return;
  }

  btn.disabled = true;
  btn.textContent = "送出中...";
  showStatus("正在上傳，請稍候...", "");

  try {
    const images = [];
    for (const file of files) {
      images.push({
        fileName: file.name,
        imageBase64: await fileToBase64(file)
      });
    }

    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ name, amount: Number(amount), note, images })
    });

    showStatus("✅ 光數登記成功", "success");
    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("note").value = "";
    imageInput.value = "";
    preview.className = "preview empty";
    preview.textContent = "尚未選擇圖片";
  } catch (err) {
    showStatus("❌ 登記失敗，請重新送出", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "送出登記";
  }
}
