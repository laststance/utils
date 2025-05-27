# 📁 Glob Pattern Cheat Sheet

Glob patterns are simplified notations for matching file and directory paths using wildcards. They are widely used in shells (like Bash), programming languages (such as Python, JavaScript), and tools (like VS Code, AWS CodePipeline).

---

## 🔤 Basic Syntax

| Pattern     | Description                                       | Example Match            | Notes                                                |
| ----------- | ------------------------------------------------- | ------------------------ | ---------------------------------------------------- |
| `*`         | Matches any number of characters except `/`       | `file.txt`, `image.png`  | Does not cross directory boundaries                  |
| `?`         | Matches exactly one character except `/`          | `a.txt`, `b.txt`         | Useful for matching single-character variations      |
| `**`        | Matches any number of characters, including `/`   | `dir/file.txt`, `a/b/c`  | Enables recursive directory matching                 |
| `[abc]`     | Matches any one character inside the brackets     | `a`, `b`, or `c`         | Can also define ranges like `[a-z]`                  |
| `[!abc]`    | Matches any one character not inside the brackets | Any except `a`, `b`, `c` | `[^abc]` is also used in some implementations        |
| `{foo,bar}` | Matches either `foo` or `bar`                     | `foo`, `bar`             | Brace expansion; not supported in all environments   |
| `\`         | Escapes the next character                        | `\*` matches literal `*` | Necessary when matching special characters literally |

---

## 📁 Folder Matching Examples

Assume the following directory structure:

```
src/
├── index.js
├── text/
│   └── node.txt
└── utils/
    └── helper.js
```

| Pattern       | Matches                                                       |
| ------------- | ------------------------------------------------------------- |
| `*`           | Matches files like `README.md` in the current directory       |
| `*/`          | Matches immediate subdirectories like `src/`, `test/`         |
| `*/index.js`  | Matches `index.js` in any immediate subdirectory              |
| `**/*.js`     | Matches all `.js` files at any depth                          |
| `src/**`      | Matches everything under `src/` including `src/text/node.txt` |
| `**/test*.js` | Matches any file starting with `test` in any subdirectory     |
| `**/`         | Matches all directories recursively                           |

### ✅ Does `src/**` match `src/text/node.txt`?

Yes, `src/**` matches `src/text/node.txt`.

* The `**` wildcard matches zero or more directories, so any file under `src/`, no matter how deep, is matched.
* Example matches include:

  * `src/index.js`
  * `src/text/`
  * `src/text/node.txt`
  * `src/utils/helper.js`

> 🔸 This is useful when you want to include all files in a directory tree using a single pattern.

---

## ⚠️ Common Mistakes and Pitfalls

* **Using backslashes (`\`) on Windows**: Always use forward slashes (`/`) in glob patterns.
* **Assuming `*` is recursive**: `*` matches only a single directory level; use `**` for recursive matching.
* **Tool-specific behavior**: Some environments require additional flags to support `**` (e.g., `recursive=True` in Python).
* **Incorrect character class usage**: Watch out for `[abc]` vs `[!abc]` syntax errors.
* **Brace expansion confusion**: Not all tools support `{foo,bar}` style expansion.

---

## 🔍 Environment-Specific Notes

* **Python**: Use `glob.glob("src/**", recursive=True)` for recursive matches.
  [Python glob documentation →](https://docs.python.org/3/library/glob.html?utm_source=chatgpt.com)
* **Bash**: Enable `globstar` with `shopt -s globstar` to allow `**` matching in scripts.
  [Unix Stack Exchange discussion →](https://unix.stackexchange.com/questions/379191/glob-to-match-subdirectories?utm_source=chatgpt.com)
* **DeepSource**: Offers good practices on using glob patterns in config files.
  [DeepSource blog →](https://deepsource.com/blog/glob-file-patterns?utm_source=chatgpt.com)

---

## 🧪 Tools to Test Glob Patterns

* [Glob Tester (DigitalOcean)](https://www.digitalocean.com/community/tools/glob)
* [Globster.xyz](https://globster.xyz/)

---

## 📚 References

* [VS Code Glob Patterns](https://code.visualstudio.com/docs/editor/glob-patterns)
* [Python glob module](https://docs.python.org/3/library/glob.html)
* [DeepSource on Globs](https://deepsource.com/blog/glob-file-patterns)
* [Bash globstar](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html)