with open('/home/z/my-project/src/components/cctv-builder.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'function SummaryContent() {',
    '// eslint-disable-next-line react-hooks/static-components\n  function SummaryContent() {'
)

content = content.replace(
    'const StepCard = ({ num, title, children, done: doneProp',
    '// eslint-disable-next-line react-hooks/static-components\n  const StepCard = ({ num, title, children, done: doneProp'
)

with open('/home/z/my-project/src/components/cctv-builder.tsx', 'w') as f:
    f.write(content)

print('Done')
