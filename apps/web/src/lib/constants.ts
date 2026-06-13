export const categoryLabels: Record<string, string> = {
  roads: "Улици",
  pavement: "Тротоари",
  street_lighting: "Осветление",
  parks: "Паркове",
  waste: "Чистота",
  public_transport: "Транспорт",
  accessibility: "Достъпност",
  drainage: "Отводняване",
  culture: "Култура",
  education: "Образование",
  other: "Друго"
};

export const categoryMarks: Record<string, string> = {
  roads: "ПТ",
  pavement: "ТР",
  street_lighting: "ОС",
  parks: "ПР",
  waste: "ЧС",
  public_transport: "ГТ",
  accessibility: "ДС",
  drainage: "ВД",
  culture: "КЛ",
  education: "ОБ",
  other: "ДР"
};

export const projectStatusLabels: Record<string, string> = {
  planned: "Планиран",
  funded: "Финансиран",
  contracted: "Договорен",
  in_progress: "В процес",
  completed: "Завършен",
  delayed: "Забавен",
  unknown: "Неизвестен"
};

export const fixStatusLabels: Record<string, string> = {
  unverified: "Непроверен",
  verified: "Проверен",
  sent_to_municipality: "Изпратен",
  in_progress: "В процес",
  fixed: "Поправен",
  closed: "Затворен"
};

export const projectStatusDescriptions: Record<string, string> = {
  planned: "Има планиран запис, но не е отбелязано изпълнение.",
  funded: "Има посочено финансиране.",
  contracted: "Има договор или етап на възлагане.",
  in_progress: "Има отбелязано текущо изпълнение.",
  completed: "Отбелязан е завършен етап.",
  delayed: "Има отбелязано забавяне.",
  unknown: "Статусът не е потвърден."
};

export const fixStatusDescriptions: Record<string, string> = {
  unverified: "Сигналът е примерен или очаква проверка.",
  verified: "Проверен е от редактор или публичен източник.",
  sent_to_municipality: "Маркиран е като изпратен към институция.",
  in_progress: "Има отбелязан текущ ремонт или проверка.",
  fixed: "Маркиран е като поправен.",
  closed: "Затворен е без активен следващ етап."
};
