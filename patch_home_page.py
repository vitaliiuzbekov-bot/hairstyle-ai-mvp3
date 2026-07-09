import sys

with open("src/components/HomePage.tsx", "r") as f:
    content = f.read()

target = """  useEffect(() => {
    setVtonResultUrl(null);
    setVtonError(null);"""

replacement = """  useEffect(() => {
    const handleSelectStyle = (e: any) => {
      setTryOnStyle(e.detail);
      // scroll to top or smoothly to the try-on section if desired
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('select-style', handleSelectStyle);
    return () => window.removeEventListener('select-style', handleSelectStyle);
  }, [setTryOnStyle]);

  useEffect(() => {
    setVtonResultUrl(null);
    setVtonError(null);"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/components/HomePage.tsx", "w") as f:
        f.write(content)
    print("Fixed")
else:
    print("target not found")
