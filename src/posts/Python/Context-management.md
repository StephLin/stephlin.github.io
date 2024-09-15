---
title: Context Management in Python
icon: fa-brands fa-python
date: 2021-01-02
categories:
  - Python
tags:
  - Python
  - Context Management
---

在執行程式的時候通常會需要存取資源，一般來說資源的來源可能是檔案、遠端連線、或是某種 Socket。當程式在調用資源的時候基本上包含兩個動作：

- 請求資源使用權 (以檔案來說就是讀或寫之類的)、以及
- 釋放資源使用權。

本篇我們將整理在 Python 中面對資源存取問題時，透過 `with` 的常見作法、其物件意涵、以及內建套件 `contextlib` 的一些使用時機。

<!-- more -->

## 單一檔案存取

假設我們有一個檔案 `input.txt`：

```
Hello world! I am a file.
This is a new line.
```

透過 Python 我們可以透過以下程式碼實現讀檔並輸出到終端機上：

```python
# access `input.txt` file with reading permission
obj = open('input.txt', 'r')

# read content and print to stdout
print(obj.read())

# release file resource
obj.close()
```

而透過 `with` 關鍵字可以幫助程式碼在這個過程中更簡潔：

```python
with open('input.txt', 'r') as f:
    print(f.read())
```

到目前為止是大家在學習 Python 的時候幾乎會碰觸到的課題，接下來我們將討論 `with` 在 Python 當中的物件意涵。

# With 關鍵字在 Python 中的物件意涵

我們同樣盯著上面的範例程式碼看，實際上他相當於以下語法結構：

```python{5,24}
import sys

# with open('input.txt', 'r') as f:
obj = open('input.txt', 'r')
f = obj.__enter__()
exc = True  # a flag to determine if process trap into the except block

try:
    # inside the with block
    print(f.read())
except:
    # go to here if there is an exception happened inside the block
    # set flag as False to avoid double-free
    exc = False
    # collect exception information
    exc_type, exc_val, exc_tb = sys.exit_info()

    if not obj.__exit__(exc_type, exc_val, exc_tb):
        raise
finally:
    if exc:
        # in this way there is no exception
        exc_type = exc_val = exc_tb = None
        obj.__exit__(exc_type, exc_val, exc_tb)
```

在這段程式碼中，我們會發現：

- 在進入 `with` 區塊前，Python 會初始化 `obj` 物件並觸發 `__enter__` 方法以存取資源，並且將其回傳值賦予到 `f`；
- 而當程序離開 `with` 區塊時，Python 會觸發 `obj` 物件的 `__exit__` 方法以釋放資源。

::: tip

在檔案的例子中，`obj.__enter__` 的回傳值實際上就是物件 `obj` 本身，而 `obj.__exit__` 方法就相當於呼叫 `obj.close` 方法。

:::

事情似乎變得複雜起來，但理解這個機制後，我們可以結合 Python 本身的 [duck typing 特性](https://en.wikipedia.org/wiki/Duck_typing) 去做更彈性的編排。舉例來說，我們可以自定義一種類別，使得在檔案資源存取的時候結合計數器功能：

```python
class FileResource(object):
    # counting times of reading and writing
    write_count = 0
    read_count = 0

    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None

    # will be triggered when process enter the with block
    def __enter__(self):
        # handling counter
        if 'w' in self.mode:
            FileResource.write_count += 1
        if 'r' in self.mode:
            FileResource.read_count += 1

        # instantiate file object and return itself
        self.file = open(self.filename, self.mode)
        return self.file

    # will be triggered when process leave the with block
    def __exit__(self, exc_type, exc_val, exc_tb):
        # when exception raised inside the with block, `exc_type` would be the
        # type of the exception, `exc_val` would be the object of such type,
        # and `exc_tb` would be the object of TracebackType.
        #
        # return True if you want to surpress this exception
        return self.file.__exit__(exc_type, exc_val, exc_tb)


if __name__ == '__main__':
    with FileResource('input.txt', 'w') as f:
        f.write('Hello world! I am a file.\nThis is a new line.')

    with FileResource('input.txt', 'r') as f:
        print('first time reading ...')

    with FileResource('input.txt', 'r') as f:
        print('second time reading ...')

    print('instantiate but not actually read ...')
    fr = FileResource('input.txt', 'r')

    print(FileResource.read_count, FileResource.write_count)
```

在執行結果中，我們會發現計數器有成功的被運作，且當檔案沒有真正開啟時不會列入計數。

```
first time reading ...
second time reading ...
instantiate but not actually read ...
2 1
```

此時我們已經具備設計自定義資源管理器的基礎技能了，現在我們要藉由 Python 強大內建套件來實現更靈活的操作。

## 使用 contextlib

這個強大內建套件就是 [contextlib](https://docs.python.org/3/library/contextlib.html)，實務上他可以幫助 Python 在處理資源管理的時候可以更加優雅。

我們以 `FileResource` 為例，在 contextlib 的加持下它可以被簡化成以下形式：

```python
import contextlib

write_count = 0
read_count = 0


@contextlib.contextmanager
def FileResource(filename, mode):
    if 'w' in mode:
        global write_count
        write_count += 1
    if 'r' in mode:
        global read_count
        read_count += 1

    obj = open(filename, mode)

    try:
        yield obj
    except:
        # you can handle exception here
        raise
    finally:
        obj.close()


if __name__ == '__main__':
    with FileResource('input.txt', 'w') as f:
        f.write('Hello world! I am a file.\nThis is a new line.')

    with FileResource('input.txt', 'r') as f:
        print('first time reading ...')

    with FileResource('input.txt', 'r') as f:
        print('second time reading ...')

    print('instantiate but not actually read ...')
    fr = FileResource('input.txt', 'r')

    print(FileResource.read_count, FileResource.write_count)
```

此時會發現說我們不用自行宣告類別就可以實現同樣的功能，且不只是更短的行數，程式碼的邏輯也變得更清晰。

以下我們透過一些案例來介紹 `contextlib` 的一些使用方法、以及額外功能。

### Case Study #1: 包裝函數

當有些語法比較彆扭的時候可以包裝起來讓程式更美觀

```python
import contextlib
import asyncssh


def get_host_info_by_config(config): ...


@contextlib.contextmanger
def open_connect_by_config(config):
    hostname, username = get_host_info_by_config(config)
    with asyncssh.connect(hostname, username=username) as conn:
        yield conn
```

### Case Study #2: 轉導 stdout 到檔案流

將在 stdout 接到的字串流當作資源，轉導引到其他檔案流 (如空裝置或標準錯誤流)。

```python
import contextlib
import os
import sys


with contextlib.redirect_stdout(None):
    print('Do not show anything')

with contextlib.redirect_stdout(sys.stderr):
    print('I would be flushed at any time!')
```

::: warning

Python 的 `redirect_stdout` 並無法捕捉所有 stdout 接收到的字串流，就算是 `sys.stdout` 也有同樣的問題，若要捕捉全部資料，需要去呼叫到底層的 file descriptor. 若有興趣的讀者請參考 [Eli Bendersky](https://github.com/eliben)： [Redirecting all kinds of stdout in Python](https://eli.thegreenplace.net/2015/redirecting-all-kinds-of-stdout-in-python/).

:::

### Case Study #3: 複數資源管理 ExitStack

- 複數資源的調用過程相當於 stack 的操作過程
- contextlib 已經實作好了，不要重造輪子

```python
import contextlib


filenames = ['input1.txt', 'input2.txt', 'input3.txt']
with contextlib.ExitStack() as stack:
    files = [stack.enter_context(open(fname)) for fname in filenames]
    # do something ...
```

## 資源管理的深層應用

在上面的案例中的資源都是十分具體的，比如說一個檔案或是一個流，而透過上述程式碼所形成的結構我們都可以稱作資源管理，意思是說「資源」也可以是一個抽象概念，比如說一個程式執行的狀態。

::: tip

或者直接將這個結構理解成：對內部區塊程式碼的前處理及後處理方法也可以。

:::

這樣的想法實際上也被應用在 Python 中的許多場景，舉例來說：

- `unittest.assertRaises` 方法可以幫助使用者單元測試一程式碼片段是否會跳出預期錯誤，但又不會讓程序中斷。
- `unittest.subTest` 方法可以幫助使用者強制執行子測試當中的所有測試，即使中間出錯也會執行到底。
- `contextlib.suppress` 方法可以幫助程序不中斷特定錯誤。

## 結論

理解 Python 的資源管理後，一方面可以讓我們在之後使用 `with` 的時候可以更有自信，另一方面也可以更加體會 Python 的一些機制、認識好用的內建套件、建立對 Python 更正確的認知、進而撰寫更漂亮的程式結構。

## References

- [PEP 0343 -- The "with" Statement](https://www.python.org/dev/peps/pep-0343/)
- [contextlib — Utilities for with-statement contexts](https://docs.python.org/3/library/contextlib.html)
- [unittest — Unit testing framework](https://docs.python.org/3/library/unittest.html)
