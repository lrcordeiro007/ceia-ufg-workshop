const API_URL = "http://localhost:8001";

const BASE_URL = "/api";

// --- UI Logic ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${tabId}`).classList.add('active');

    // Update Active Button State
    const btn = document.querySelector(`button[onclick*="'${tabId}'"]`);
    if (btn) btn.classList.add('active');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// --- Status Polling ---
async function checkStatus() {
    try {
        const res = await fetch(`${BASE_URL}/health`);
        const data = await res.json();

        updateStatus('api-status', 'online');
        updateStatus('llm-status', 'online');
        updateStatus('db-status', 'online');
    } catch (e) {
        updateStatus('api-status', 'offline');
        updateStatus('llm-status', 'offline');
        updateStatus('db-status', 'offline');
    }
}

function updateStatus(id, state) {
    const el = document.getElementById(id);
    el.className = `status-indicator ${state}`;
}

setInterval(checkStatus, 5000);
checkStatus();

// --- Chat Logic ---
async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    // UI Updates
    addMessage(text, 'user');
    input.value = '';

    // Show Loading in Debug
    document.getElementById('debug-retrieved').innerHTML = '<span class="pulse-text">Buscando documentos...</span>';
    document.getElementById('debug-prompt').innerHTML = '<span class="pulse-text">Construindo prompt...</span>';
    document.getElementById('debug-response').innerHTML = '<span class="pulse-text">Gerando resposta...</span>';

    try {
        const res = await fetch(`${BASE_URL}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: text })
        });

        const data = await res.json();

        // 1. Update Chat
        addMessage(data.answer, 'system');

        // 2. Update Debug Visualization
        renderDebug(data);

    } catch (e) {
        addMessage("Erro ao conectar com o servidor.", 'system');
        console.error(e);
    }
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `
        <div class="avatar"><ion-icon name="${sender === 'user' ? 'person' : 'pulse'}"></ion-icon></div>
        <div class="bubble">${text}</div>
    `;
    document.getElementById('chat-messages').appendChild(div);
    div.scrollIntoView({ behavior: 'smooth' });
}

function renderDebug(data) {
    // Retrieved Docs
    const docsHtml = data.retrieved_docs.map((doc, i) =>
        `<div class="doc-item"><strong>Doc ${i + 1}:</strong> ${doc}</div>`
    ).join('');
    document.getElementById('debug-retrieved').innerHTML = docsHtml || "Nenhum documento relevante encontrado.";

    // Escape HTML to prevent rendering injection
    const promptSafe = data.built_prompt.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    document.getElementById('debug-prompt').innerHTML = `<pre>${promptSafe}</pre>`;

    // Response
    document.getElementById('debug-response').innerHTML = data.answer;
}

// --- Ingest Logic ---
async function ingestData() {
    const textMsg = document.getElementById('ingest-text').value;
    const fileInput = document.getElementById('ingest-file');
    const source = document.getElementById('ingest-source').value || "User Manual";
    const status = document.getElementById('ingest-status');
    const hasFile = fileInput.files.length > 0;

    if (!textMsg && !hasFile) return;

    status.innerText = "Processando...";
    status.style.color = "var(--text-muted)";

    try {
        let success = false;

        // 1. Ingest Text if present
        if (textMsg) {
            const res = await fetch(`${BASE_URL}/ingest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texts: [textMsg], source: source })
            });
            if (res.ok) success = true;
        }

        // 2. Ingest File if present
        if (hasFile) {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            const res = await fetch(`${BASE_URL}/ingest-file`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) success = true;
            else {
                const err = await res.json();
                status.innerText = `Erro no arquivo: ${err.detail}`;
                status.style.color = "var(--error)";
                return;
            }
        }

        if (success) {
            status.innerHTML = "<span class='pulse-text' style='color: var(--success)'>Sucesso! Conhecimento adicionado.</span>";
            document.getElementById('ingest-text').value = "";
            fileInput.value = "";
        } else {
            status.innerText = "Erro ao processar.";
            status.style.color = "var(--error)";
        }
    } catch (e) {
        status.innerText = "Erro de conexão.";
        status.style.color = "var(--error)";
        console.error(e);
    }
}

// Enter key support
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
