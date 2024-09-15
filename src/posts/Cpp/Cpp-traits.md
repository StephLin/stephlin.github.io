---
title: C++ Traits 不專業使用心得
icon: code
date: 2021-11-13
categories:
  - C++
tags:
  - C++
  - Traits
  - Template
---

::: note
近期在閱讀一些 C++ Library 的過程中發現了 C++ Traits 的使用概念，於是乎來整理一下他的想法以及實現方法。
:::

Traits 簡單來講就是一個程式碼片段，而我們希望透過一些機制，把他當作補丁一般地，貼到某塊程式碼內。

這個概念若使用得當，最大的好處在於我們不用重複實作相同的功能 (或是相似的架構)，進而提升程式碼的重複利用度、以及簡潔程度。

> _Think of a trait as a small object whose main purpose is to carry information used by another object or algorithm to determine "policy" or "implementation details"._
> --- <FontIcon icon="fa-solid fa-user" /> Bjarne Stroustrup

我們先看最簡單的案例，PHP，他有一個關鍵字就直接叫做 `trait`，只要在其中定義想要打包的程式碼，就可以再利用 `use` 貼到任何類別：

```php{2-5,8,13}
<?php
trait ezcReflectionReturnInfo {
    function getReturnType() { /*1*/ }
    function getReturnDescription() { /*2*/ }
}

class ezcReflectionMethod extends ReflectionMethod {
    use ezcReflectionReturnInfo;
    /* ... */
}

class ezcReflectionFunction extends ReflectionFunction {
    use ezcReflectionReturnInfo;
    /* ... */
}
?>
```

在這個例子當中，`ezcReflectionMethod` 和 `ezcReflectionFunction` 都同時擁有 `getReturnType()` 和 `getReturnDescription()` 這兩個方法，就這方面來講 PHP 真的是滿直觀的，不過你會發現他就真的只是複製貼上而已。

:::tip
Trait 跟 inheritance (繼承) 最大的差異是：trait 更接近於文本的複製貼上 (只是這個過程是編譯器幫你完成的)，而繼承則是一個物件導向的概念，具備更多類別之間的相互關係。
:::

如果是 C++ 的話，我們稱之為 **trait class**，他依靠了 C++ template (generic programming) 去實現這個想法，而仰賴模板偏特化 (partial template specialization) 的特性，我們可以進一步允許當使用者輸入不同的類別時，他會貼上個別對應的實作方法。

## 實作案例

先來看一個例子：

```cpp
#include <iostream>

// generic type
template<typename T>
struct traits {
  static bool is_void() { return false; }
};

// partial template specialization
template<>
struct traits<void> {
  static bool is_void() { return true; }
};

int main() {
  std::cout << (traits<int>::is_void() ? "True" : "False") << '\n';
  std::cout << (traits<float>::is_void() ? "True" : "False") << '\n';
  std::cout << (traits<void>::is_void() ? "True" : "False") << '\n';

  return 0;
}
```

在這個例子中，我們使用了 template struct 宣告並定義在一般情況 (非 `void` 的其他所有型態) 與特定情況 (`void` 型態) 在 `is_void()` 函數中的行為，並且很簡易地在主函數中直接呼叫。

::: tip
在 C++ 當中， `struct` 跟 `class` 基本上是在講同樣的東西 (從編譯器的角度也是)，差異是 `struct` 中的成員預設為 `public`，而 `class` 中的成員預設為 `private`.
:::

你可能不知道的是，C++ 的 `struct` 跟 C 的 `struct` 反而不是同樣的東西。

這個例子的輸出結果是滿直覺的：

```
False
False
True
```

我們可以進一步將主函數當中的行為包裝成一個 template function：

```cpp{15-18}
#include <iostream>

// generic type
template<typename T>
struct traits {
  static bool is_void() { return false; }
};

// partial template specialization
template<>
struct traits<void> {
  static bool is_void() { return true; }
};

template<typename T>
void print_type_is_void() {
  std::cout << (traits<T>::is_void() ? "True" : "False") << '\n';
}

int main() {
  print_type_is_void<int>();
  print_type_is_void<float>();
  print_type_is_void<void>();

  return 0;
}
```

在這個例子裡，我們已經可以看到 `print_type_is_void<T>()` 會根據他接收到的型態 `T` 去決定要實際向誰取得實作內容。按照這個例子的話，如果 `T` 是 `void` ，他會把含有 `return true;` 的那個函數拿來使用，其他的則是會把含有 `return false;` 的另外一個來使用。

我們再把 C++ template 玩深一點，實際上更多的使用情境是：不見得每個型態都有相同的行為，而在抽象層面上我們也不是很介意各自實作細節。因此我們只要有 `trait` 那個皮就好，裡面的餡料我們晚點再一個個型態各自定義：

```cpp{3-4}
#include <iostream>

// declaration
template<typename T> struct traits;

template<>
struct traits<int> {
  static bool is_void() { return false; }
};

template<>
struct traits<float> {
  static bool is_void() { return false; }
};

template<>
struct traits<void> {
  static bool is_void() { return true; }
};

template<typename T>
void print_type_is_void() {
  std::cout << (traits<T>::is_void() ? "True" : "False") << '\n';
}

int main() {
  print_type_is_void<int>();
  print_type_is_void<float>();
  print_type_is_void<void>();

  return 0;
}
```

這個時候 `struct traits<T>` 就只剩下宣告而已，至於 `print_type_is_void<T>()` 其實只要知道有 `struct traits<T>` 的存在就可以寫程式了。意思是說，你只需要在 `print_type_is_void<T>()` 要抓 `T=int`, `T=float`, `T=void` 的實際行為時，你再告訴他定義就好了，程式碼不見得需要寫在一起。

抓住這個想法，我們把程式碼拆解成三個檔案：

```cpp
// lib.h

#pragma once
#include <iostream>

// forward declaration
template<typename T> struct traits;

template<typename T>
void print_type_is_void() {
  std::cout << (traits<T>::is_void() ? "True" : "False") << '\n';
}
```

```cpp
  // impl.h

  #pragma once

  // declaration
  template<typename T> struct traits;

  template<>
  struct traits<int> {
    static bool is_void() { return false; }
  };

  template<>
  struct traits<float> {
    static bool is_void() { return false; }
  };

  template<>
  struct traits<void> {
    static bool is_void() { return true; }
  };
```

```cpp
// t.cpp

#include "lib.h"
#include "impl.h"

int main() {
  print_type_is_void<int>();
  print_type_is_void<float>();
  print_type_is_void<void>();

  return 0;
}
```

其中在 `lib.h` 我們使用了 forward declaration，不過想得單純一點，其實就是我把 `#include "impl.h"` 替換成 `template<typename T> struct traits;` 這樣。

:::tip
Forward declaration 的最大幫助在於可以降低程式碼之間的耦合程度，縮短編譯時間 (我不需要改一個小區塊，就把全部的程式碼都重新編譯)。

他的合法使用時機在於編譯器是否需要知道他的實際結構 (記憶體、函數等)。在不需要知道實際結構，而只取其指標來用的前提下，我們才能透過 forward declaration 將編譯行為拆解成數個子區塊。嚴格來講，上述我們的例子並沒有做到這件事情，所以他們還是需要一起編譯。
:::

此時我們已經可以稍微感受到「黏貼」的味道：在 `t.cpp` 當中，我們把 `impl.h` 裡面的實作細節，貼到 `lib.h` 裡面的函數當中。這個基本上就是 C++ Trait 的主要想法，不過實際操作上更多的是活用 C++ Template 的特性。

:::note
以至於這篇文章用某種角度來看就是 C++ template 複習篇 XD
:::

## 舉一個更實際的案例

筆者當初是在閱讀 [GTSAM](https://github.com/borglab/gtsam) 時認識到這個用法，在這份實作當中他們的應用情境是在不同李群當中 Lie group $\mathcal{M}$ 與 Lie algebra $\mathfrak{m}$ 之間的映射關係 ($\exp: \mathcal{M} \to \mathfrak{m}$ 和 $\log: \mathfrak{m} \to \mathcal{M}$)，不同的李群包含旋轉群 (special orthogonal group, rotation group) $\mathrm{SO}(n)$ 或特殊歐基里德群 (special Euclidean group) $\mathrm{SE}(n)$，他們對應的函數 $\exp$ 和 $\log$ 不盡相同，但也是存在一些李群內泛用的公式，比如說李群對應到微分流形 (differentiable manifold) 之微積分行為這類的，在這種情境底下套用 trait 的概念就還滿方便的。

不過這個案例有點太超過了 (數學方面的那種)，我們舉一個比較通俗的案例：單變數微分的連鎖律 (chain rule)。

避免可能有讀者不太清楚微積分，快速複習一下單變數的連鎖律：給定兩個函數 $f, g:\mathbb{R}\to\mathbb{R}$，滿足以下定律：

$$
\Big( f \circ g \Big)'(x) = f'(g(x)) g'(x)
$$

其中那個 $'$ 代表的是對 $x$ 微分的意思。

為求簡便，我們預計來實作兩個簡單的函數，一個是二次多項式函數 $f_1(x) = x^2$，另一個是指數函數 $f_2(x) = e^x$. 所以我們有 $f_1'(x) = 2x$ 和 $f_2'(x) = e^x$. 有這些先備知識後我們就可以來實作了：

```cpp
// lib.h

#pragma once

template<typename T> struct traits;

template<typename F, typename G>
double derivative_of(double x) {
  return traits<F>::derivative_of( traits<G>::of(x) ) * traits<G>::derivative_of(x);
}
```

```cpp
// impl.h

#pragma once
#include <cmath>

template<typename T> struct traits;

class Square {};
class Exp {};

template<>
struct traits<Square> {
  static double of(double x) { return x * x; }
  static double derivative_of(double x) { return 2 * x; }
};

template<>
struct traits<Exp> {
  static double of(double x) { return exp(x); }
  static double derivative_of(double x) { return of(x); }
};
```

```cpp
// t.cpp

#include <iostream>

#include "lib.h"
#include "impl.h"

int main() {
  // Square ( Exp (x) )
  std::cout << "derivative of exp(x)^2 at x=0: "
            << derivative_of<Square, Exp>(0) << '\n';

  // Exp ( Square (x) )
  std::cout << "derivative of exp(x^2) at x=0: "
            << derivative_of<Exp, Square>(0) << '\n';

  return 0;
}
```

在這個實作方式下，兩個類別 `Square` 和 `Exp` 會變成是空的類別，內部並沒有任何函數。輸出如下：

```
derivative of exp(x)^2 at x=0: 2
derivative of exp(x^2) at x=0: 0
```

讀者可以快速驗算一下，應該是正確的。

:::note
筆者在這邊澄清一點是：並不是只有一個實作方法可以實現上述案例，比如說你可以把 `of()` 和 `derivative_of()` 直接定義在 `Square` 跟 `Exp` 裡面，不過當你基於某些理由，不希望破壞類別內部方法結構時，trait 會變成是一個還不錯的選擇。
:::

## 型態檢查

接著我們進一步探討：如何限制型態結構？

C++11 引進了 type traits 的概念，提供了一些關於型態的檢查工具。從傳統物件導向的角度來說，我們可以透過多型去選擇參數的可輸入型態，然而這邊「傳統」的意思是說，正常的物件導向裡面並沒有模板的概念。

不過 type traits 幫了我們一把，使得我們可以實踐這個想法，例子如下：

```cpp
// base.h

#pragma once
class Function {};
```

```cpp{4,12,13}
// lib.h

#pragma once
#include <type_traits>

#include "base.h"

template<typename T> struct traits;

template<typename F, typename G>
double derivative_of(double x) {
  static_assert(std::is_base_of<Function, F>::value, "F should be a Function");
  static_assert(std::is_base_of<Function, G>::value, "G should be a Function");

  return traits<F>::derivative_of( traits<G>::of(x) ) * traits<G>::derivative_of(x);
}
```

其中 `std::is_base_of<OO, XX>` 是 `type_traits` 標頭裡面提供的 structure，他會告訴我們 `XX` 是否繼承 `OO`，而檢查的結果會回饋在 `::value` 上。以我們的例子來說，這邊又定義了一個基底類別 `Function` 讓其他型態繼承，而我們希望輸入進來的型態 `F` 跟 `G` 有繼承 `Function`.

接著另一個重點是 `static_assert`，以前我們熟知的是 `assert`，他的行為是在執行期間 (runtime) 動態的檢查，而 `static_assert` 的關鍵特性是他會在編譯期間 (compile-time) 做檢查，這個特性使得模板中的型態 (同樣也是在編譯期間就完成處理) 可以被檢查。

加上這個條件後，因為我們還沒有修改 `impl.h`，所以照理講他們都是不符合條件的，此時編譯 `g++ -std=c++11 t.cpp -o t` 會噴以下錯誤訊息：

```text{4,7,12,15}
In file included from t.cpp:3:0:
lib.h: In instantiation of ‘double derivative_of(double) [with F = Square; G = Exp]’:
t.cpp:9:44:   required from here
lib.h:10:3: error: static assertion failed: F should be a Function
  static_assert(std::is_base_of<Function, F>::value, "F should be a Function");
  ^~~~~~~~~~~~~
lib.h:11:3: error: static assertion failed: G should be a Function
  static_assert(std::is_base_of<Function, G>::value, "G should be a Function");
  ^~~~~~~~~~~~~
lib.h: In instantiation of ‘double derivative_of(double) [with F = Exp; G = Square]’:
t.cpp:13:44:   required from here
lib.h:10:3: error: static assertion failed: F should be a Function
  static_assert(std::is_base_of<Function, F>::value, "F should be a Function");
  ^~~~~~~~~~~~~
lib.h:11:3: error: static assertion failed: G should be a Function
  static_assert(std::is_base_of<Function, G>::value, "G should be a Function");
  ^~~~~~~~~~~~~
```

因此我們需要再調整一下 `Square` 跟 `Exp` 才能滿足我們剛剛給定的條件：

```cpp{10,11}
// impl.h

#pragma once
#include <cmath>

#include "base.h"

template<typename T> struct traits;

class Square: public Function {};
class Exp: public Function {};

template<>
struct traits<Square> {
  static double of(double x) { return x * x; }
  static double derivative_of(double x) { return 2 * x; }
};

template<>
struct traits<Exp> {
  static double of(double x) { return exp(x); }
  static double derivative_of(double x) { return of(x); }
};
```

但是這個招數不是萬能的，除了方法的侷限 (你總不能叫 `int` 也繼承自 `Function`，他只是型態不是類別) 外，他強制了該模板的型態必須具備相同的繼承關係，而不是強制他必須具備某種「結構」或「特性」。就這個角度來說，比起限制類型的繼承關係，限制他是否擁有這個函數顯然更靠譜一些。

抱持著這個想法，我們換個做法：

```cpp{6-19,21-34,38-39,41-42}
#pragma once
#include <type_traits>

template<typename T> struct traits;

template <typename T>
class has_of {
  typedef char expected;
  struct not_expected { char x[2]; };

  template <typename C>
  static expected test( decltype(traits<C>::of(std::declval<double>())) );

  template <typename C>
  static not_expected test(...) { return 0; };

public:
  enum { value = sizeof(test<T>(0)) == sizeof(expected) };
};

template <typename T>
class has_derivative_of {
  typedef char expected;
  struct not_expected { char x[2]; };

  template <typename C>
  static expected test( decltype(traits<C>::derivative_of(std::declval<double>())) );

  template <typename C>
  static not_expected test(...);

public:
  enum { value = sizeof(test<T>(0)) == sizeof(expected) };
};

template<typename F, typename G>
double derivative_of(double x) {
  static_assert(has_of<F>::value, "F should implement the member function `double of(double)`.");
  static_assert(has_of<G>::value, "G should implement the member function `double of(double)`.");

  static_assert(has_derivative_of<F>::value, "F should implement the member function `double derivative_of(double)`.");
  static_assert(has_derivative_of<G>::value, "G should implement the member function `double derivative_of(double)`.");

  return traits<F>::derivative_of( traits<G>::of(x) ) * traits<G>::derivative_of(x);
}
```

這次我們利用了 SFINAE (替換失敗並非錯誤, substitution failure is not an error) 去判斷型態是否有指定的靜態函數 `of` 與 `derivative_of`，此時我們就不需要局限於繼承的手法，而且可以執行更精準的判斷。

::: tip
留意到目前階段我們只有檢查函數是否存在，但還沒有檢查輸出格式。
:::

# 結論

在本篇我們大致了解 C++ trait 的想法以及實現方式，除了我們可以更順暢地閱讀外面的一些實作，免得說出現「我不知道他在寫什麼鬼東西哭阿」的這種窘境之外，也可以讓我們未來在實作 C++ 相關專案的時候，手上可以有更多的工具或手法讓專案更簡潔或更強健！

# References

1. [Standard library header <type_traits> - cppreference.com](https://en.cppreference.com/w/cpp/header/type_traits)
2. [An introduction to C++ Traits - ACCU Blog](https://accu.org/journals/overload/9/43/frogley_442)
3. [Templated check for the existence of a class member function - Stack Overflow](https://stackoverflow.com/questions/257288/templated-check-for-the-existence-of-a-class-member-function)
