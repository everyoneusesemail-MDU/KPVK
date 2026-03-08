const residents = [
  {
    id: 1,
    code: "VK-1042",
    firstName: "Алексей",
    lastName: "Иванов",
    middleName: "Петрович",
    houseNumber: "42",
    cadastralNumber: "90:19:010101:421",
    plotNumber: "У-42",
    houseModel: "Классик 125",
    area: 125,
    debt: 12450,
    monthlyPayment: 4800
  },
  {
    id: 2,
    code: "VK-1088",
    firstName: "Елена",
    lastName: "Смирнова",
    middleName: "Викторовна",
    houseNumber: "88",
    cadastralNumber: "90:19:010101:882",
    plotNumber: "У-88",
    houseModel: "Комфорт 140",
    area: 140,
    debt: 0,
    monthlyPayment: 5200
  },
  {
    id: 3,
    code: "VK-1120",
    firstName: "Игорь",
    lastName: "Кузнецов",
    middleName: "Андреевич",
    houseNumber: "120",
    cadastralNumber: "90:19:010101:1203",
    plotNumber: "У-120",
    houseModel: "Семейный 165",
    area: 165,
    debt: 3100,
    monthlyPayment: 6100
  }
];

const chatThreads = [
  { id: "general", title: "Общие вопросы" },
  { id: "utilities", title: "Коммунальные услуги" },
  { id: "neighbors", title: "Соседи и объявления" },
  { id: "security", title: "Охрана и КПП" }
];

const faqData = [
  {
    q: "Как оплатить услуги управляющей компании?",
    a: "Оплата доступна в личном кабинете через QR платежа (в рабочем приложении) или по реквизитам УК."
  },
  {
    q: "Как вызвать сервисную службу?",
    a: "Откройте раздел «Сервисная служба», заполните форму и отправьте заявку. Администратор получит ее сразу."
  },
  {
    q: "Сколько действует гостевой QR-пропуск?",
    a: "Каждый код одноразовый: отдельный QR для въезда и отдельный QR для выезда."
  }
];

const instructionsData = [
  { type: "Файл PDF", title: "Инструкция по инженерным системам", link: "#" },
  { type: "Видео", title: "Как обслуживать систему отопления", link: "#" },
  { type: "Видео", title: "Проверка электросети и щита", link: "#" },
  { type: "Файл PDF", title: "Уход за фасадом и кровлей", link: "#" }
];

const usefulNumbers = [
  { service: "Охрана КПП", phone: "+7 (978) 111-10-10" },
  { service: "Управляющая компания", phone: "+7 (978) 111-20-20" },
  { service: "Сервисная служба", phone: "+7 (978) 111-30-30" },
  { service: "Аварийная электрослужба", phone: "+7 (978) 111-40-40" },
  { service: "Аварийная водоканал", phone: "+7 (978) 111-50-50" }
];

const newsData = [
  {
    title: "Запуск весенней уборки территории",
    date: "05.03.2026",
    text: "С 10 марта начинается плановая уборка общественных зон и обслуживание озеленения."
  },
  {
    title: "Новый график вывоза ТБО",
    date: "01.03.2026",
    text: "Вывоз бытовых отходов будет выполняться 3 раза в неделю: пн, ср, пт."
  },
  {
    title: "Открытие детской площадки",
    date: "24.02.2026",
    text: "Площадка у северного парка введена в эксплуатацию и доступна для посещения."
  }
];

const afishaData = [
  {
    title: "Соседский пикник",
    date: "15.03.2026",
    text: "Семейный пикник в центральном парке, начало в 13:00."
  },
  {
    title: "Кино под открытым небом",
    date: "20.03.2026",
    text: "Просмотр семейного фильма в амфитеатре, начало в 19:30."
  },
  {
    title: "Детский мастер-класс",
    date: "22.03.2026",
    text: "Творческий мастер-класс в клубном доме для детей 6+."
  }
];

let currentUser = null;
let activeThreadId = chatThreads[0].id;

const STORAGE = {
  session: "villaCrimeaSession",
  chats: "villaCrimeaChats",
  directs: "villaCrimeaDirects",
  service: "villaCrimeaService",
  passes: "villaCrimeaPasses"
};

const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const userBadge = document.getElementById("userBadge");
const authMessage = document.getElementById("authMessage");
const authCodeInput = document.getElementById("authCode");
const desiredDateTimeInput = document.getElementById("desiredDateTime");
const asapCheckbox = document.getElementById("asapCheckbox");
const qrDialog = document.getElementById("qrDialog");
const qrDialogTitle = document.getElementById("qrDialogTitle");
const qrImage = document.getElementById("qrImage");
const qrText = document.getElementById("qrText");

function nowString() {
  return new Date().toLocaleString("ru-RU");
}

function money(v) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(v);
}

function randomToken(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (_err) {
    return fallback;
  }
}

function getChats() {
  const fallback = {
    general: [
      { author: "Система", house: "-", text: "Добро пожаловать в общий чат жителей!", at: nowString() }
    ],
    utilities: [],
    neighbors: [],
    security: []
  };
  return getStorage(STORAGE.chats, fallback);
}

function getDirects() {
  return getStorage(STORAGE.directs, []);
}

function getServiceRequests() {
  return getStorage(STORAGE.service, []);
}

function getPasses() {
  return getStorage(STORAGE.passes, []);
}

function renderProfile() {
  const profileGrid = document.getElementById("profileGrid");
  const fields = [
    ["Имя", currentUser.firstName],
    ["Фамилия", currentUser.lastName],
    ["Отчество", currentUser.middleName],
    ["Номер дома", currentUser.houseNumber],
    ["Кадастровый номер", currentUser.cadastralNumber],
    ["Номер участка", currentUser.plotNumber],
    ["Модель дома", currentUser.houseModel],
    ["Площадь", `${currentUser.area} м²`]
  ];
  profileGrid.innerHTML = fields
    .map(
      ([k, v]) =>
        `<article class="profile-item"><strong>${k}</strong><span>${v}</span></article>`
    )
    .join("");

  document.getElementById("debtAmount").textContent = money(currentUser.debt);
  document.getElementById("monthlyAmount").textContent = money(currentUser.monthlyPayment);
}

function renderThreads() {
  const threadList = document.getElementById("threadList");
  threadList.innerHTML = chatThreads
    .map((t) => {
      const active = t.id === activeThreadId ? "active" : "";
      return `<li class="thread-item ${active}" data-thread-id="${t.id}">${t.title}</li>`;
    })
    .join("");

  threadList.querySelectorAll(".thread-item").forEach((el) => {
    el.addEventListener("click", () => {
      activeThreadId = el.dataset.threadId;
      renderThreads();
      renderChatMessages();
    });
  });
}

function renderChatMessages() {
  const thread = chatThreads.find((t) => t.id === activeThreadId);
  document.getElementById("activeThreadTitle").textContent = `Ветка: ${thread.title}`;

  const chats = getChats();
  const messages = chats[activeThreadId] || [];
  const container = document.getElementById("chatMessages");
  if (!messages.length) {
    container.innerHTML = "<p class='muted'>Пока сообщений нет.</p>";
    return;
  }

  container.innerHTML = messages
    .map(
      (m) => `
        <article class="bubble">
          <strong>${m.author}</strong> <small>(дом ${m.house}) • ${m.at}</small>
          <div>${m.text}</div>
        </article>
      `
    )
    .join("");
  container.scrollTop = container.scrollHeight;
}

function renderDirectMessages() {
  const directs = getDirects();
  const inbox = directs.filter((d) => d.toHouse === currentUser.houseNumber);
  const sent = directs.filter((d) => d.fromHouse === currentUser.houseNumber);

  const inboxList = document.getElementById("directInbox");
  const sentList = document.getElementById("directSent");

  inboxList.innerHTML = inbox.length
    ? inbox
        .map(
          (m) => `
            <li class="list-item">
              <strong>От дома ${m.fromHouse}</strong>
              <div>${m.text}</div>
              <small>${m.at}</small>
            </li>
          `
        )
        .join("")
    : "<li class='list-item muted'>Нет входящих сообщений.</li>";

  sentList.innerHTML = sent.length
    ? sent
        .map(
          (m) => `
            <li class="list-item">
              <strong>К дому ${m.toHouse}</strong>
              <div>${m.text}</div>
              <small>${m.at}</small>
            </li>
          `
        )
        .join("")
    : "<li class='list-item muted'>Нет отправленных сообщений.</li>";
}

function renderDirectSelect() {
  const select = document.getElementById("directHouseSelect");
  const options = residents
    .filter((r) => r.houseNumber !== currentUser.houseNumber)
    .map((r) => `<option value="${r.houseNumber}">Дом ${r.houseNumber}</option>`)
    .join("");
  select.innerHTML = `<option value="">Выберите номер дома</option>${options}`;
}

function renderServiceRequests() {
  const requests = getServiceRequests().filter((r) => r.houseNumber === currentUser.houseNumber);
  const list = document.getElementById("serviceRequests");
  list.innerHTML = requests.length
    ? requests
        .map(
          (r) => `
            <li class="list-item">
              <strong>Заявка #${r.id}</strong>
              <div>Описание: ${r.description}</div>
              <div>Срочность: ${r.urgency}</div>
              <div>Желаемое время: ${r.desiredDateTime}</div>
              <div>Статус: ${r.status}</div>
              <small>Создано: ${r.at}</small>
            </li>
          `
        )
        .join("")
    : "<li class='list-item muted'>Вы ещё не создавали заявки.</li>";
}

function passToQrData(pass, direction) {
  const token = direction === "entry" ? pass.entryToken : pass.exitToken;
  return JSON.stringify({
    passId: pass.id,
    direction: direction === "entry" ? "Въезд" : "Выезд",
    token,
    guest: pass.guestFullName,
    house: pass.issuedByHouse
  });
}

function qrImageUrl(payload) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`;
}

function openQrDialog(title, payload) {
  qrDialogTitle.textContent = title;
  qrImage.src = qrImageUrl(payload);
  qrText.textContent = payload;
  qrDialog.showModal();
}

function renderPasses() {
  const tbody = document.getElementById("securityTableBody");
  const passes = getPasses();
  if (!passes.length) {
    tbody.innerHTML = "<tr><td colspan='8' class='muted'>Пропуска пока не созданы.</td></tr>";
    return;
  }

  tbody.innerHTML = passes
    .map((p) => {
      const entryBtn = `<button type="button" class="button-secondary small" data-action="show-entry" data-id="${p.id}">Показать</button>`;
      const exitBtn = `<button type="button" class="button-secondary small" data-action="show-exit" data-id="${p.id}">Показать</button>`;
      const markEntryBtn = p.entryAt
        ? `<span>${p.entryAt}</span>`
        : `<button type="button" class="small" data-action="mark-entry" data-id="${p.id}">Отметить въезд</button>`;
      const markExitBtn = p.exitAt
        ? `<span>${p.exitAt}</span>`
        : `<button type="button" class="small" data-action="mark-exit" data-id="${p.id}" ${p.entryAt ? "" : "disabled"}>Отметить выезд</button>`;

      return `
        <tr>
          <td>${p.guestFullName}</td>
          <td>${p.guestPhone}</td>
          <td>Дом ${p.issuedByHouse}</td>
          <td>${p.issuedAt}</td>
          <td>${entryBtn}</td>
          <td>${exitBtn}</td>
          <td>${markEntryBtn}</td>
          <td>${markExitBtn}</td>
        </tr>
      `;
    })
    .join("");
}

function renderStaticBlocks() {
  document.getElementById("faqList").innerHTML = faqData
    .map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`)
    .join("");

  document.getElementById("instructionsList").innerHTML = instructionsData
    .map(
      (item) => `
        <article class="list-item">
          <strong>${item.type}</strong>
          <div>${item.title}</div>
          <a href="${item.link}">Открыть</a>
        </article>
      `
    )
    .join("");

  document.getElementById("numbersList").innerHTML = usefulNumbers
    .map(
      (n) => `
        <li class="list-item">
          <strong>${n.service}</strong>
          <div><a href="tel:${n.phone.replace(/[^\d+]/g, "")}">${n.phone}</a></div>
        </li>
      `
    )
    .join("");

  document.getElementById("newsList").innerHTML = newsData
    .map(
      (item) => `
        <article class="news-card">
          <small>${item.date}</small>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");

  document.getElementById("afishaList").innerHTML = afishaData
    .map(
      (item) => `
        <article class="news-card">
          <small>${item.date}</small>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

function mountApp() {
  authSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  userBadge.classList.remove("hidden");
  userBadge.textContent = `${currentUser.lastName} ${currentUser.firstName}, дом ${currentUser.houseNumber}`;

  renderProfile();
  renderThreads();
  renderChatMessages();
  renderDirectSelect();
  renderDirectMessages();
  renderServiceRequests();
  renderPasses();
  renderStaticBlocks();
}

function unmountApp() {
  appSection.classList.add("hidden");
  authSection.classList.remove("hidden");
  userBadge.classList.add("hidden");
  userBadge.textContent = "";
}

function restoreSession() {
  const id = getStorage(STORAGE.session, null);
  if (!id) return;
  const resident = residents.find((r) => r.id === id);
  if (!resident) return;
  currentUser = resident;
  mountApp();
}

document.getElementById("authForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const code = authCodeInput.value.trim().toUpperCase();
  const resident = residents.find((r) => r.code.toUpperCase() === code);
  if (!resident) {
    authMessage.textContent = "Код не найден. Проверьте правильность или используйте демо-код.";
    authMessage.style.color = "var(--danger)";
    return;
  }
  currentUser = resident;
  setStorage(STORAGE.session, resident.id);
  authMessage.textContent = "";
  mountApp();
});

document.getElementById("demoCodeBtn").addEventListener("click", () => {
  const randomResident = residents[Math.floor(Math.random() * residents.length)];
  authCodeInput.value = randomResident.code;
  authMessage.textContent = `Сгенерирован демо-код: ${randomResident.code} (дом ${randomResident.houseNumber})`;
  authMessage.style.color = "var(--success)";
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem(STORAGE.session);
  unmountApp();
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"));
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.view).classList.add("active");
  });
});

document.getElementById("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentUser) return;
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  const chats = getChats();
  chats[activeThreadId].push({
    author: `${currentUser.lastName} ${currentUser.firstName}`,
    house: currentUser.houseNumber,
    text,
    at: nowString()
  });
  setStorage(STORAGE.chats, chats);
  input.value = "";
  renderChatMessages();
});

document.getElementById("directForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentUser) return;
  const toHouse = document.getElementById("directHouseSelect").value;
  const text = document.getElementById("directText").value.trim();
  if (!toHouse || !text) return;
  const directs = getDirects();
  directs.push({
    id: randomToken("dm"),
    fromHouse: currentUser.houseNumber,
    toHouse,
    text,
    at: nowString()
  });
  setStorage(STORAGE.directs, directs);
  document.getElementById("directForm").reset();
  renderDirectSelect();
  renderDirectMessages();
});

asapCheckbox.addEventListener("change", () => {
  desiredDateTimeInput.disabled = asapCheckbox.checked;
  if (asapCheckbox.checked) {
    desiredDateTimeInput.value = "";
  }
});

document.getElementById("serviceForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentUser) return;
  const description = document.getElementById("problemDescription").value.trim();
  const urgency = document.getElementById("urgency").value;
  const desiredDateTime = asapCheckbox.checked
    ? "Как можно скорее"
    : desiredDateTimeInput.value
      ? new Date(desiredDateTimeInput.value).toLocaleString("ru-RU")
      : "Не указано";
  if (!description || !urgency) return;

  const requests = getServiceRequests();
  requests.unshift({
    id: randomToken("sr"),
    houseNumber: currentUser.houseNumber,
    description,
    urgency,
    desiredDateTime,
    at: nowString(),
    status: "Принято администратором сервисной службы"
  });
  setStorage(STORAGE.service, requests);
  document.getElementById("serviceForm").reset();
  desiredDateTimeInput.disabled = false;
  renderServiceRequests();
});

document.getElementById("passForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentUser) return;
  const lastName = document.getElementById("guestLastName").value.trim();
  const firstName = document.getElementById("guestFirstName").value.trim();
  const middleName = document.getElementById("guestMiddleName").value.trim();
  const guestPhone = document.getElementById("guestPhone").value.trim();
  if (!lastName || !firstName || !middleName || !guestPhone) return;

  const pass = {
    id: randomToken("pass"),
    guestFullName: `${lastName} ${firstName} ${middleName}`,
    guestPhone,
    issuedByHouse: currentUser.houseNumber,
    issuedAt: nowString(),
    entryToken: randomToken("IN"),
    exitToken: randomToken("OUT"),
    entryAt: null,
    exitAt: null
  };

  const passes = getPasses();
  passes.unshift(pass);
  setStorage(STORAGE.passes, passes);
  document.getElementById("passForm").reset();
  renderPasses();
});

document.getElementById("securityTableBody").addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) return;

  const passes = getPasses();
  const pass = passes.find((p) => p.id === id);
  if (!pass) return;

  if (action === "show-entry") {
    openQrDialog("QR-код на въезд (одноразовый)", passToQrData(pass, "entry"));
  } else if (action === "show-exit") {
    openQrDialog("QR-код на выезд (одноразовый)", passToQrData(pass, "exit"));
  } else if (action === "mark-entry") {
    if (!pass.entryAt) {
      pass.entryAt = nowString();
      setStorage(STORAGE.passes, passes);
      renderPasses();
    }
  } else if (action === "mark-exit") {
    if (pass.entryAt && !pass.exitAt) {
      pass.exitAt = nowString();
      setStorage(STORAGE.passes, passes);
      renderPasses();
    }
  }
});

document.getElementById("closeQrDialog").addEventListener("click", () => {
  qrDialog.close();
});

restoreSession();
