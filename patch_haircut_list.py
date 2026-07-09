import sys

with open("src/components/HaircutList.tsx", "r") as f:
    content = f.read()

# remove state
state_target = 'const [isLibraryOpen, setIsLibraryOpen] = useState(false);'
content = content.replace(state_target, '')

# change onClick
btn_target = 'onClick={() => setIsLibraryOpen(true)}'
btn_replacement = "onClick={() => window.dispatchEvent(new Event('open-library'))}"
content = content.replace(btn_target, btn_replacement)

# remove createPortal
portal_start = '{isLibraryOpen &&'
portal_end_marker = ')}' # wait, there are multiple portals or conditions, let's find the exact block

import re
# The block is inside the return statement. It starts with {isLibraryOpen && createPortal(
# We can just remove it using regex, or string manipulation.
portal_pattern = re.compile(r'\{isLibraryOpen &&\s*createPortal\(.*?\)\s*\}', re.DOTALL)
content = portal_pattern.sub('', content)

with open("src/components/HaircutList.tsx", "w") as f:
    f.write(content)

print("Done")
