import os
import glob

replacements = {
    'bg-white': 'bg-slate-800',
    'bg-slate-50': 'bg-slate-900',
    'bg-teal-50/50': 'bg-indigo-500/10',
    'bg-teal-50/20': 'bg-indigo-500/5',
    'bg-teal-50': 'bg-fuchsia-500/10',
    'border-slate-200': 'border-slate-700/50',
    'border-slate-100': 'border-slate-700/50',
    'text-slate-900': 'text-white',
    'text-slate-800': 'text-slate-100',
    'text-slate-600': 'text-slate-300',
    'text-slate-500': 'text-slate-400',
    'text-teal-900': 'text-fuchsia-300',
    'text-teal-800': 'text-indigo-300',
    'text-teal-700': 'text-indigo-300',
    'text-teal-600': 'text-purple-300',
    'bg-teal-600': 'bg-indigo-500/80',
    'hover:bg-teal-700': 'hover:bg-indigo-500',
    'hover:bg-slate-50/50': 'hover:bg-slate-700/30',
    'hover:bg-slate-50': 'hover:bg-slate-700',
    'bg-white/80': 'bg-slate-900/80',
    'shadow-sm': 'shadow-none',
    'hover:border-teal-200': 'hover:border-purple-400/50',
    'bg-teal-900': 'bg-slate-950',
    'divide-teal-700': 'divide-slate-800',
    'text-teal-300': 'text-fuchsia-300',
    'text-teal-100/70': 'text-slate-400',
    'text-teal-400': 'text-indigo-400',
    'hover:text-teal-300': 'hover:text-indigo-300',
    'hover:text-slate-900': 'hover:text-white',
    'fill-slate-500': 'fill-slate-400',
    'fill-slate-700': 'fill-slate-200',
}

files = glob.glob('src/**/*.jsx', recursive=True)
files.append('src/App.jsx') # just in case

for file in set(files):
    if not os.path.exists(file): continue
    with open(file, 'r') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(file, 'w') as f:
        f.write(content)
        
print("Theming applied.")
