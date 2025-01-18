---
title: 從陷阱案例中理解 Python 變數綁定機制
icon: fa-brands fa-python
date: 2025-01-12
cover: /assets/images/posts/python/python-variable-binding/cover.jpg
categories:
  - Python
tags:
  - Python
  - Closure
  - Gotcha
---

本文嘗試透過一些案例去加深理解 Python 的變數綁定機制，降低因語言特性導致的隱藏問題，導致偵錯困難。

<!-- more -->

我們首先來看一個例子：

```python
functions = []

for x in range(3):
    functions.append(lambda dx: x + dx)

print([f(1) for f in functions])
```

從文意上閱讀這段程式碼，我們或許會預期他會得到以下結果：

```python
[1, 2, 3]
```

但他其實會得到以下結果：

```python
[3, 3, 3]
```

為什麼會這樣呢？我們先從 wtfpython[^wtfpython] 上面的說明看起：

> When defining a function inside a loop that uses the loop variable in its
> body, the loop function's closure is bound to the variable, not its value. The
> function looks up x in the surrounding context, rather than using the value of
> x at the time the function is created. ...

意思是說，當我們在 for loop 裡面定義 lambda 函數的時候，我們並不是把 `x` 的數值依序以 0, 1, 2 的順序複製到函數裡面去，而是**將函數的變數 `x` 綁定到外部的 `x` 變數上**。

![變數綁定示意圖](/assets/images/posts/python/python-variable-binding/ex1-variable-mapping.png)

這種定義在外部 scope 的變數在 Python 被稱為 closure variable (或者 free variable)[^closure-definition]，我們也可以透過 Python 的內建模組 `inspect` 確認這件事情：

```python
import inspect
print(inspect.getclosurevars(functions[0]))
```

他會輸出以下結果：

```python
ClosureVars(nonlocals={}, globals={'x': 2}, builtins={}, unbound=set())
```

我們會看到 `x` 變數確實是透過 global variable 的形式綁定進 `functions[0]` 函數裡面，並且他也告訴你當下 `i` 的數值為 2.

:::details Closure Variable Types
根據向外部綁定的變數類型不同，可分為 global variable 和 nonlocal variable 這兩種，在這篇文章裡面的案例是 global variable。若我們將上述範例全放進一個函數內，並且從外部呼叫，那麼此時 `x` 就會變成一個 nonlocal variable：

![X as a nonlocal variable](/assets/images/posts/python/python-variable-binding/ex1-1-nonlocal-variable.png)

此時使用 `print(inspect.getclosurevars(functions[0]))` 就會得到以下結果：

```python
ClosureVars(nonlocals={'x': 2}, globals={}, builtins={}, unbound=set())
```

由於 nonlocal variable 對 lambda function 而言仍然是一個外部變數，且在 `functions` 裡面的所有函數都還是綁定到相同的 nonlocal variable `x`，所以你還是會得到同樣的結果：

```python
[3, 3, 3]
```

關於 nonlocal variable 的更多說明可以參考 Dboy Liao 的文章[^closure]。
:::

如果我們想要避免變數以這種形式綁定到函數裡面去的話，我們可以將 `x` 的數值以 default function argument 的形式傳遞進去：

```python
functions = []

for x in range(3):
    functions.append(lambda dx, x=x: x + dx)
```

這個做法的原理在於：他會在函數被宣告的當下初始化一個 default argument `x`，並且將當下的全域變數 `x` 的數值傳遞進去。這個時候，在 lambda function 內部的 `x` 就變成一個 local variable.

![修改後的變數綁定示意圖，注意箭頭所指的位置](/assets/images/posts/python/python-variable-binding/ex2-variable-mapping.png)

:::tip Inspect function arguments by signature
我們可以透過 `inspect.signature(functions[0]).parameters` 的方式去觀察函數的參數資訊。
:::

我們可以對比兩種做法在變數綁定上的差異，修改後的方法重點在於各 lambda function 又自行創建了一個變數，並且儲存對應數值作為他的預設參數數值。

![修改前後的變數綁定示意圖](/assets/images/posts/python/python-variable-binding/ex1-ex2-variable-mapping.png)

透過以上修改，我們就可以看到以下程式碼

```python
print([f(1) for f in functions])
```

輸出以下結果：

```python
[1, 2, 3]
```

在利用這個做法的時候，我們需要注意一件事情是：default function argument 的數值只會在函數被宣告的當下被計算，而不是在函數被執行的當下被計算。在今天的案例所使用的數值是一個不可變物件 (immutable variable)，不會有太大的問題。 **但如果今天的數值是可變物件 (mutable variable) 的話，就需要小心了 ── 假若函數內會對 default mutable argument 修改，是會影響到函數內所帶的預設參數數值的**[^wtfpython-mutable-argument]。

我們對上面的程式碼做一些修改：

```python
import typing as T


class Value:
    def __init__(self, x):
        self.x = x

    def __add__(self, dx) -> T.Self:
        self.x += dx
        return self

    def __repr__(self) -> str:
        return f"Value({self.x})"


functions = []

for x in range(3):
    functions.append(lambda dx, x=Value(x): x + dx)
```

在這個範例中，函數內的 `x` 變成一個可變物件，並且在函數被宣告的當下初始化一個預設參數數值，並且我們**刻意定義他的加法行為會修改它內部的成員變數數值**。

在這個狀況下，你會發現重複執行他的函數

```python
print([f(1) for f in functions])
print([f(1) for f in functions])
print([f(1) for f in functions])
```

會出現以下結果：

```python
[Value(1), Value(2), Value(3)]
[Value(2), Value(3), Value(4)]
[Value(3), Value(4), Value(5)]
```

因此我們在設計函數的時候，要避免使用可變物件當作 default argument。用上述的例子來說明，我們可以將 global variable `x` 的數值以不可變物件 (`int`) 的形式傳遞進去，改由在函數內部宣告可變物件：

```python
functions = []

for x in range(3):
    functions.append(lambda dx, x=x: Value(x) + dx)
```

這樣就可以確保物件是在每次函數執行的當下才會被初始化，而不是所有函數都共用同一個物件：

```python
[Value(1), Value(2), Value(3)]
[Value(1), Value(2), Value(3)]
[Value(1), Value(2), Value(3)]
```

:::note Disclosure
本文封面圖片由 [tensor.art](https://tensor.art/) 生成。
:::

[^wtfpython]: [satwikkansal/wtfpython > Schrödingers variable](https://github.com/satwikkansal/wtfpython?tab=readme-ov-file#-schr%C3%B6dingers-variable-)
[^wtfpython-mutable-argument]: [satwikkansal/wtfpython > Beware of default mutable arguments](https://github.com/satwikkansal/wtfpython?tab=readme-ov-file#-beware-of-default-mutable-arguments)
[^gotchas]: https://docs.python-guide.org/writing/gotchas/
[^closure]: [聊聊 Python Closure - Dboy Liao](https://dboyliao.medium.com/聊聊-python-closure-ebd63ff0146f)
[^closure-definition]: [Python 3 Documentation > Glossary > closure variable](https://docs.python.org/3/glossary.html#term-closure-variable)
