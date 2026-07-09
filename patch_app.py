import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = "  const { deleteHistoryItem } = useHistoryHandlers(history, setHistory, userId);"
replacement = """  const { deleteHistoryItem } = useHistoryHandlers(history, setHistory, userId);

  useEffect(() => {
    const handleOpenLibrary = () => setIsLibraryOpen(true);
    window.addEventListener('open-library', handleOpenLibrary);
    return () => window.removeEventListener('open-library', handleOpenLibrary);
  }, [setIsLibraryOpen]);"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
