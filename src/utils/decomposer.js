// Smart Micro-Task Decomposer (Anti-Procrastination Task Breakdown Engine)

const ACTION_TEMPLATES = {
  writing: [
    'Open document & write a 1-sentence outline',
    'Write 3 bullet points for core sections',
    'Draft first rough paragraph without editing',
    'Review & polish final wording',
  ],
  coding: [
    'Open workspace & inspect target file',
    'Write function signature & basic logic flow',
    'Test core happy-path execution',
    'Handle edge cases & clean up formatting',
  ],
  study: [
    'Gather notes & open chapter outline',
    'Read & highlight 3 key concepts',
    'Write a 2-minute summary in your own words',
    'Self-quiz on core definitions',
  ],
  planning: [
    'List the 3 main outcomes required',
    'Identify the single smallest 5-minute first step',
    'Set up necessary files/links',
  ],
  default: [
    'Gather materials & clear workspace distractions',
    'Do 5 minutes of initial setup/drafting',
    'Complete the main core action block',
    'Quick 2-minute review & mark complete',
  ]
};

export function decomposeTask(title, category = '') {
  const lowerTitle = title.toLowerCase();
  let subtasks = [];

  if (lowerTitle.includes('write') || lowerTitle.includes('doc') || lowerTitle.includes('report') || lowerTitle.includes('email')) {
    subtasks = ACTION_TEMPLATES.writing;
  } else if (lowerTitle.includes('code') || lowerTitle.includes('build') || lowerTitle.includes('bug') || lowerTitle.includes('dev')) {
    subtasks = ACTION_TEMPLATES.coding;
  } else if (lowerTitle.includes('study') || lowerTitle.includes('read') || lowerTitle.includes('learn') || lowerTitle.includes('exam')) {
    subtasks = ACTION_TEMPLATES.study;
  } else if (lowerTitle.includes('plan') || lowerTitle.includes('schedule') || lowerTitle.includes('organize')) {
    subtasks = ACTION_TEMPLATES.planning;
  } else {
    subtasks = ACTION_TEMPLATES.default;
  }

  return subtasks.map((stepText, idx) => ({
    id: `sub-${Date.now()}-${idx}`,
    title: stepText,
    completed: false,
  }));
}
