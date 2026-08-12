import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "const handleOpenFeedback = () => setIsFeedbackOpen(true);",
    "const handleOpenFeedback = () => setIsFeedbackOpen(true);\n    const handleOpenTutorial = () => setShowTutorial(true);"
)

content = content.replace(
    "window.addEventListener('open-feedback-modal', handleOpenFeedback);",
    "window.addEventListener('open-feedback-modal', handleOpenFeedback);\n    window.addEventListener('open-tutorial', handleOpenTutorial);"
)

content = content.replace(
    "window.removeEventListener('open-feedback-modal', handleOpenFeedback);",
    "window.removeEventListener('open-feedback-modal', handleOpenFeedback);\n      window.removeEventListener('open-tutorial', handleOpenTutorial);"
)

with open("src/App.tsx", "w") as f:
    f.write(content)
