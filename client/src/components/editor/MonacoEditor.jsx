import React, { useRef, useEffect } from 'react';
import Editor, { loader } from '@monaco-editor/react';

// Define a premium custom dark theme
function defineThemes(monaco) {
  monaco.editor.defineTheme('cp-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '4A5568', fontStyle: 'italic' },
      { token: 'keyword', foreground: '9F7AEA' },
      { token: 'string', foreground: '68D391' },
      { token: 'number', foreground: 'F6AD55' },
      { token: 'type', foreground: '63B3ED' },
      { token: 'function', foreground: 'FBD38D' },
      { token: 'variable', foreground: 'E2E8F0' },
    ],
    colors: {
      'editor.background': '#0A0A0A',
      'editor.foreground': '#E2E8F0',
      'editor.lineHighlightBackground': '#141414',
      'editor.selectionBackground': '#C0C0C020',
      'editor.inactiveSelectionBackground': '#C0C0C010',
      'editorLineNumber.foreground': '#2A2A2A',
      'editorLineNumber.activeForeground': '#6B6B6B',
      'editorCursor.foreground': '#C0C0C0',
      'editor.findMatchBackground': '#C0C0C030',
      'editorGutter.background': '#0A0A0A',
      'editorIndentGuide.background': '#1E1E1E',
      'editorIndentGuide.activeBackground': '#2A2A2A',
      'scrollbarSlider.background': '#1E1E1E80',
      'scrollbarSlider.hoverBackground': '#2A2A2A80',
    },
  });

  monaco.editor.defineTheme('cp-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '9CA3AF', fontStyle: 'italic' },
      { token: 'keyword', foreground: '7C3AED' },
      { token: 'string', foreground: '059669' },
      { token: 'number', foreground: 'D97706' },
      { token: 'type', foreground: '2563EB' },
      { token: 'function', foreground: 'B45309' },
    ],
    colors: {
      'editor.background': '#FAFAFA',
      'editor.foreground': '#1A1A1A',
      'editor.lineHighlightBackground': '#F0F0F0',
      'editorLineNumber.foreground': '#CCCCCC',
      'editorLineNumber.activeForeground': '#999999',
      'editorCursor.foreground': '#1A1A1A',
      'editor.selectionBackground': '#C0C0C030',
      'editorGutter.background': '#FAFAFA',
    },
  });
}

export default function MonacoEditor({ value, onChange, language, isDark, onCursorChange }) {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    defineThemes(monaco);
    monaco.editor.setTheme(isDark ? 'cp-dark' : 'cp-light');

    // Keyboard shortcut: Ctrl+Enter / Cmd+Enter to run
    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        document.getElementById('btn-run-code')?.click();
      },
    });

    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      onCursorChange?.({
        line: e.position.lineNumber,
        col: e.position.column,
      });
    });

    // Focus editor on mount
    editor.focus();
  }

  // Switch theme when isDark changes
  useEffect(() => {
    if (editorRef.current) {
      import('monaco-editor').then((monaco) => {
        monaco.editor.setTheme(isDark ? 'cp-dark' : 'cp-light');
      }).catch(() => {
        // monaco-editor not available directly, handled by loader
      });
    }
  }, [isDark]);

  return (
    <Editor
      height="100%"
      language={language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language}
      value={value}
      onChange={onChange}
      theme={isDark ? 'cp-dark' : 'cp-light'}
      beforeMount={defineThemes}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 4,
        insertSpaces: true,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        lineNumbersMinChars: 3,
        renderLineHighlight: 'line',
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        suggest: { showKeywords: true },
        quickSuggestions: { other: true, comments: false, strings: false },
        wordWrap: 'off',
        renderWhitespace: 'none',
        folding: true,
        foldingHighlight: false,
        showFoldingControls: 'mouseover',
        contextmenu: true,
      }}
    />
  );
}