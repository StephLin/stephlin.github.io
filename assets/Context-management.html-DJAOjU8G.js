import{_ as p}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as o,o as i,c,d as n,b as s,a as e,e as t}from"./app-CgrXBgdR.js";const l={},u=t(`<p>在執行程式的時候通常會需要存取資源，一般來說資源的來源可能是檔案、遠端連線、或是某種 Socket。當程式在調用資源的時候基本上包含兩個動作：</p><ul><li>請求資源使用權 (以檔案來說就是讀或寫之類的)、以及</li><li>釋放資源使用權。</li></ul><p>本篇我們將整理在 Python 中面對資源存取問題時，透過 <code>with</code> 的常見作法、其物件意涵、以及內建套件 <code>contextlib</code> 的一些使用時機。</p><h2 id="單一檔案存取" tabindex="-1"><a class="header-anchor" href="#單一檔案存取"><span>單一檔案存取</span></a></h2><p>假設我們有一個檔案 <code>input.txt</code>：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>Hello world! I am a file.
This is a new line.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>透過 Python 我們可以透過以下程式碼實現讀檔並輸出到終端機上：</p><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token comment"># access \`input.txt\` file with reading permission</span>
obj <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span>

<span class="token comment"># read content and print to stdout</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment"># release file resource</span>
obj<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而透過 <code>with</code> 關鍵字可以幫助程式碼在這個過程中更簡潔：</p><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>f<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>到目前為止是大家在學習 Python 的時候幾乎會碰觸到的課題，接下來我們將討論 <code>with</code> 在 Python 當中的物件意涵。</p><h1 id="with-關鍵字在-python-中的物件意涵" tabindex="-1"><a class="header-anchor" href="#with-關鍵字在-python-中的物件意涵"><span>With 關鍵字在 Python 中的物件意涵</span></a></h1><p>我們同樣盯著上面的範例程式碼看，實際上他相當於以下語法結構：</p><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token keyword">import</span> sys

<span class="token comment"># with open(&#39;input.txt&#39;, &#39;r&#39;) as f:</span>
obj <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span>
f <span class="token operator">=</span> obj<span class="token punctuation">.</span>__enter__<span class="token punctuation">(</span><span class="token punctuation">)</span>
exc <span class="token operator">=</span> <span class="token boolean">True</span>  <span class="token comment"># a flag to determine if process trap into the except block</span>

<span class="token keyword">try</span><span class="token punctuation">:</span>
    <span class="token comment"># inside the with block</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>f<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token keyword">except</span><span class="token punctuation">:</span>
    <span class="token comment"># go to here if there is an exception happened inside the block</span>
    <span class="token comment"># set flag as False to avoid double-free</span>
    exc <span class="token operator">=</span> <span class="token boolean">False</span>
    <span class="token comment"># collect exception information</span>
    exc_type<span class="token punctuation">,</span> exc_val<span class="token punctuation">,</span> exc_tb <span class="token operator">=</span> sys<span class="token punctuation">.</span>exit_info<span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">if</span> <span class="token keyword">not</span> obj<span class="token punctuation">.</span>__exit__<span class="token punctuation">(</span>exc_type<span class="token punctuation">,</span> exc_val<span class="token punctuation">,</span> exc_tb<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">raise</span>
<span class="token keyword">finally</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> exc<span class="token punctuation">:</span>
        <span class="token comment"># in this way there is no exception</span>
        exc_type <span class="token operator">=</span> exc_val <span class="token operator">=</span> exc_tb <span class="token operator">=</span> <span class="token boolean">None</span>
        obj<span class="token punctuation">.</span>__exit__<span class="token punctuation">(</span>exc_type<span class="token punctuation">,</span> exc_val<span class="token punctuation">,</span> exc_tb<span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><br><br><br><br><div class="highlight-line"> </div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line"> </div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在這段程式碼中，我們會發現：</p><ul><li>在進入 <code>with</code> 區塊前，Python 會初始化 <code>obj</code> 物件並觸發 <code>__enter__</code> 方法以存取資源，並且將其回傳值賦予到 <code>f</code>；</li><li>而當程序離開 <code>with</code> 區塊時，Python 會觸發 <code>obj</code> 物件的 <code>__exit__</code> 方法以釋放資源。</li></ul><div class="hint-container tip"><p class="hint-container-title">Tips</p><p>在檔案的例子中，<code>obj.__enter__</code> 的回傳值實際上就是物件 <code>obj</code> 本身，而 <code>obj.__exit__</code> 方法就相當於呼叫 <code>obj.close</code> 方法。</p></div>`,17),r={href:"https://en.wikipedia.org/wiki/Duck_typing",target:"_blank",rel:"noopener noreferrer"},d=t(`<div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">FileResource</span><span class="token punctuation">(</span><span class="token builtin">object</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token comment"># counting times of reading and writing</span>
    write_count <span class="token operator">=</span> <span class="token number">0</span>
    read_count <span class="token operator">=</span> <span class="token number">0</span>

    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> filename<span class="token punctuation">,</span> mode<span class="token punctuation">)</span><span class="token punctuation">:</span>
        self<span class="token punctuation">.</span>filename <span class="token operator">=</span> filename
        self<span class="token punctuation">.</span>mode <span class="token operator">=</span> mode
        self<span class="token punctuation">.</span><span class="token builtin">file</span> <span class="token operator">=</span> <span class="token boolean">None</span>

    <span class="token comment"># will be triggered when process enter the with block</span>
    <span class="token keyword">def</span> <span class="token function">__enter__</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token comment"># handling counter</span>
        <span class="token keyword">if</span> <span class="token string">&#39;w&#39;</span> <span class="token keyword">in</span> self<span class="token punctuation">.</span>mode<span class="token punctuation">:</span>
            FileResource<span class="token punctuation">.</span>write_count <span class="token operator">+=</span> <span class="token number">1</span>
        <span class="token keyword">if</span> <span class="token string">&#39;r&#39;</span> <span class="token keyword">in</span> self<span class="token punctuation">.</span>mode<span class="token punctuation">:</span>
            FileResource<span class="token punctuation">.</span>read_count <span class="token operator">+=</span> <span class="token number">1</span>

        <span class="token comment"># instantiate file object and return itself</span>
        self<span class="token punctuation">.</span><span class="token builtin">file</span> <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span>self<span class="token punctuation">.</span>filename<span class="token punctuation">,</span> self<span class="token punctuation">.</span>mode<span class="token punctuation">)</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span><span class="token builtin">file</span>

    <span class="token comment"># will be triggered when process leave the with block</span>
    <span class="token keyword">def</span> <span class="token function">__exit__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> exc_type<span class="token punctuation">,</span> exc_val<span class="token punctuation">,</span> exc_tb<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token comment"># when exception raised inside the with block, \`exc_type\` would be the</span>
        <span class="token comment"># type of the exception, \`exc_val\` would be the object of such type,</span>
        <span class="token comment"># and \`exc_tb\` would be the object of TracebackType.</span>
        <span class="token comment">#</span>
        <span class="token comment"># return True if you want to surpress this exception</span>
        <span class="token keyword">return</span> self<span class="token punctuation">.</span><span class="token builtin">file</span><span class="token punctuation">.</span>__exit__<span class="token punctuation">(</span>exc_type<span class="token punctuation">,</span> exc_val<span class="token punctuation">,</span> exc_tb<span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">&#39;__main__&#39;</span><span class="token punctuation">:</span>
    <span class="token keyword">with</span> FileResource<span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;w&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
        f<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">&#39;Hello world! I am a file.\\nThis is a new line.&#39;</span><span class="token punctuation">)</span>

    <span class="token keyword">with</span> FileResource<span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;first time reading ...&#39;</span><span class="token punctuation">)</span>

    <span class="token keyword">with</span> FileResource<span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;second time reading ...&#39;</span><span class="token punctuation">)</span>

    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;instantiate but not actually read ...&#39;</span><span class="token punctuation">)</span>
    fr <span class="token operator">=</span> FileResource<span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span>

    <span class="token keyword">print</span><span class="token punctuation">(</span>FileResource<span class="token punctuation">.</span>read_count<span class="token punctuation">,</span> FileResource<span class="token punctuation">.</span>write_count<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在執行結果中，我們會發現計數器有成功的被運作，且當檔案沒有真正開啟時不會列入計數。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>first time reading ...
second time reading ...
instantiate but not actually read ...
2 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此時我們已經具備設計自定義資源管理器的基礎技能了，現在我們要藉由 Python 強大內建套件來實現更靈活的操作。</p><h2 id="使用-contextlib" tabindex="-1"><a class="header-anchor" href="#使用-contextlib"><span>使用 contextlib</span></a></h2>`,5),k={href:"https://docs.python.org/3/library/contextlib.html",target:"_blank",rel:"noopener noreferrer"},v=t(`<p>我們以 <code>FileResource</code> 為例，在 contextlib 的加持下它可以被簡化成以下形式：</p><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token keyword">import</span> contextlib

write_count <span class="token operator">=</span> <span class="token number">0</span>
read_count <span class="token operator">=</span> <span class="token number">0</span>


<span class="token decorator annotation punctuation">@contextlib<span class="token punctuation">.</span>contextmanager</span>
<span class="token keyword">def</span> <span class="token function">FileResource</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> mode<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">if</span> <span class="token string">&#39;w&#39;</span> <span class="token keyword">in</span> mode<span class="token punctuation">:</span>
        <span class="token keyword">global</span> write_count
        write_count <span class="token operator">+=</span> <span class="token number">1</span>
    <span class="token keyword">if</span> <span class="token string">&#39;r&#39;</span> <span class="token keyword">in</span> mode<span class="token punctuation">:</span>
        <span class="token keyword">global</span> read_count
        read_count <span class="token operator">+=</span> <span class="token number">1</span>

    obj <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> mode<span class="token punctuation">)</span>

    <span class="token keyword">try</span><span class="token punctuation">:</span>
        <span class="token keyword">yield</span> obj
    <span class="token keyword">except</span><span class="token punctuation">:</span>
        <span class="token comment"># you can handle exception here</span>
        <span class="token keyword">raise</span>
    <span class="token keyword">finally</span><span class="token punctuation">:</span>
        obj<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>


<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">&#39;__main__&#39;</span><span class="token punctuation">:</span>
    <span class="token keyword">with</span> FileResource<span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;w&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
        f<span class="token punctuation">.</span>write<span class="token punctuation">(</span><span class="token string">&#39;Hello world! I am a file.\\nThis is a new line.&#39;</span><span class="token punctuation">)</span>

    <span class="token keyword">with</span> FileResource<span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;first time reading ...&#39;</span><span class="token punctuation">)</span>

    <span class="token keyword">with</span> FileResource<span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;second time reading ...&#39;</span><span class="token punctuation">)</span>

    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;instantiate but not actually read ...&#39;</span><span class="token punctuation">)</span>
    fr <span class="token operator">=</span> FileResource<span class="token punctuation">(</span><span class="token string">&#39;input.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">)</span>

    <span class="token keyword">print</span><span class="token punctuation">(</span>FileResource<span class="token punctuation">.</span>read_count<span class="token punctuation">,</span> FileResource<span class="token punctuation">.</span>write_count<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此時會發現說我們不用自行宣告類別就可以實現同樣的功能，且不只是更短的行數，程式碼的邏輯也變得更清晰。</p><p>以下我們透過一些案例來介紹 <code>contextlib</code> 的一些使用方法、以及額外功能。</p><h3 id="case-study-1-包裝函數" tabindex="-1"><a class="header-anchor" href="#case-study-1-包裝函數"><span>Case Study #1: 包裝函數</span></a></h3><p>當有些語法比較彆扭的時候可以包裝起來讓程式更美觀</p><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token keyword">import</span> contextlib
<span class="token keyword">import</span> asyncssh


<span class="token keyword">def</span> <span class="token function">get_host_info_by_config</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>


<span class="token decorator annotation punctuation">@contextlib<span class="token punctuation">.</span>contextmanger</span>
<span class="token keyword">def</span> <span class="token function">open_connect_by_config</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span><span class="token punctuation">:</span>
    hostname<span class="token punctuation">,</span> username <span class="token operator">=</span> get_host_info_by_config<span class="token punctuation">(</span>config<span class="token punctuation">)</span>
    <span class="token keyword">with</span> asyncssh<span class="token punctuation">.</span>connect<span class="token punctuation">(</span>hostname<span class="token punctuation">,</span> username<span class="token operator">=</span>username<span class="token punctuation">)</span> <span class="token keyword">as</span> conn<span class="token punctuation">:</span>
        <span class="token keyword">yield</span> conn
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="case-study-2-轉導-stdout-到檔案流" tabindex="-1"><a class="header-anchor" href="#case-study-2-轉導-stdout-到檔案流"><span>Case Study #2: 轉導 stdout 到檔案流</span></a></h3><p>將在 stdout 接到的字串流當作資源，轉導引到其他檔案流 (如空裝置或標準錯誤流)。</p><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token keyword">import</span> contextlib
<span class="token keyword">import</span> os
<span class="token keyword">import</span> sys


<span class="token keyword">with</span> contextlib<span class="token punctuation">.</span>redirect_stdout<span class="token punctuation">(</span><span class="token boolean">None</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;Do not show anything&#39;</span><span class="token punctuation">)</span>

<span class="token keyword">with</span> contextlib<span class="token punctuation">.</span>redirect_stdout<span class="token punctuation">(</span>sys<span class="token punctuation">.</span>stderr<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;I would be flushed at any time!&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),m={class:"hint-container warning"},b=n("p",{class:"hint-container-title"},"Warning",-1),h=n("code",null,"redirect_stdout",-1),y=n("code",null,"sys.stdout",-1),g={href:"https://github.com/eliben",target:"_blank",rel:"noopener noreferrer"},_={href:"https://eli.thegreenplace.net/2015/redirecting-all-kinds-of-stdout-in-python/",target:"_blank",rel:"noopener noreferrer"},w=t(`<h3 id="case-study-3-複數資源管理-exitstack" tabindex="-1"><a class="header-anchor" href="#case-study-3-複數資源管理-exitstack"><span>Case Study #3: 複數資源管理 ExitStack</span></a></h3><ul><li>複數資源的調用過程相當於 stack 的操作過程</li><li>contextlib 已經實作好了，不要重造輪子</li></ul><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token keyword">import</span> contextlib


filenames <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&#39;input1.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;input2.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;input3.txt&#39;</span><span class="token punctuation">]</span>
<span class="token keyword">with</span> contextlib<span class="token punctuation">.</span>ExitStack<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">as</span> stack<span class="token punctuation">:</span>
    files <span class="token operator">=</span> <span class="token punctuation">[</span>stack<span class="token punctuation">.</span>enter_context<span class="token punctuation">(</span><span class="token builtin">open</span><span class="token punctuation">(</span>fname<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">for</span> fname <span class="token keyword">in</span> filenames<span class="token punctuation">]</span>
    <span class="token comment"># do something ...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="資源管理的深層應用" tabindex="-1"><a class="header-anchor" href="#資源管理的深層應用"><span>資源管理的深層應用</span></a></h2><p>在上面的案例中的資源都是十分具體的，比如說一個檔案或是一個流，而透過上述程式碼所形成的結構我們都可以稱作資源管理，意思是說「資源」也可以是一個抽象概念，比如說一個程式執行的狀態。</p><div class="hint-container tip"><p class="hint-container-title">Tips</p><p>或者直接將這個結構理解成：對內部區塊程式碼的前處理及後處理方法也可以。</p></div><p>這樣的想法實際上也被應用在 Python 中的許多場景，舉例來說：</p><ul><li><code>unittest.assertRaises</code> 方法可以幫助使用者單元測試一程式碼片段是否會跳出預期錯誤，但又不會讓程序中斷。</li><li><code>unittest.subTest</code> 方法可以幫助使用者強制執行子測試當中的所有測試，即使中間出錯也會執行到底。</li><li><code>contextlib.suppress</code> 方法可以幫助程序不中斷特定錯誤。</li></ul><h2 id="結論" tabindex="-1"><a class="header-anchor" href="#結論"><span>結論</span></a></h2><p>理解 Python 的資源管理後，一方面可以讓我們在之後使用 <code>with</code> 的時候可以更有自信，另一方面也可以更加體會 Python 的一些機制、認識好用的內建套件、建立對 Python 更正確的認知、進而撰寫更漂亮的程式結構。</p><h2 id="references" tabindex="-1"><a class="header-anchor" href="#references"><span>References</span></a></h2>`,11),f={href:"https://www.python.org/dev/peps/pep-0343/",target:"_blank",rel:"noopener noreferrer"},x={href:"https://docs.python.org/3/library/contextlib.html",target:"_blank",rel:"noopener noreferrer"},P={href:"https://docs.python.org/3/library/unittest.html",target:"_blank",rel:"noopener noreferrer"};function R(j,T){const a=o("ExternalLinkIcon");return i(),c("div",null,[u,n("p",null,[s("事情似乎變得複雜起來，但理解這個機制後，我們可以結合 Python 本身的 "),n("a",r,[s("duck typing 特性"),e(a)]),s(" 去做更彈性的編排。舉例來說，我們可以自定義一種類別，使得在檔案資源存取的時候結合計數器功能：")]),d,n("p",null,[s("這個強大內建套件就是 "),n("a",k,[s("contextlib"),e(a)]),s("，實務上他可以幫助 Python 在處理資源管理的時候可以更加優雅。")]),v,n("div",m,[b,n("p",null,[s("Python 的 "),h,s(" 並無法捕捉所有 stdout 接收到的字串流，就算是 "),y,s(" 也有同樣的問題，若要捕捉全部資料，需要去呼叫到底層的 file descriptor. 若有興趣的讀者請參考 "),n("a",g,[s("Eli Bendersky"),e(a)]),s("： "),n("a",_,[s("Redirecting all kinds of stdout in Python"),e(a)]),s(".")])]),w,n("ul",null,[n("li",null,[n("a",f,[s('PEP 0343 -- The "with" Statement'),e(a)])]),n("li",null,[n("a",x,[s("contextlib — Utilities for with-statement contexts"),e(a)])]),n("li",null,[n("a",P,[s("unittest — Unit testing framework"),e(a)])])])])}const C=p(l,[["render",R],["__file","Context-management.html.vue"]]),E=JSON.parse(`{"path":"/posts/Python/Context-management.html","title":"Context Management in Python","lang":"en-US","frontmatter":{"title":"Context Management in Python","icon":"fa-brands fa-python","date":"2021-01-02T00:00:00.000Z","categories":["Python"],"tags":["Python","Context Management"],"description":"在執行程式的時候通常會需要存取資源，一般來說資源的來源可能是檔案、遠端連線、或是某種 Socket。當程式在調用資源的時候基本上包含兩個動作： 請求資源使用權 (以檔案來說就是讀或寫之類的)、以及 釋放資源使用權。 本篇我們將整理在 Python 中面對資源存取問題時，透過 with 的常見作法、其物件意涵、以及內建套件 contextlib 的一些使...","head":[["meta",{"property":"og:url","content":"https://stephlin.github.io/posts/Python/Context-management.html"}],["meta",{"property":"og:site_name","content":"StephLin's Personal Blog"}],["meta",{"property":"og:title","content":"Context Management in Python"}],["meta",{"property":"og:description","content":"在執行程式的時候通常會需要存取資源，一般來說資源的來源可能是檔案、遠端連線、或是某種 Socket。當程式在調用資源的時候基本上包含兩個動作： 請求資源使用權 (以檔案來說就是讀或寫之類的)、以及 釋放資源使用權。 本篇我們將整理在 Python 中面對資源存取問題時，透過 with 的常見作法、其物件意涵、以及內建套件 contextlib 的一些使..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-09-15T10:59:27.000Z"}],["meta",{"property":"article:author","content":"Yu-Kai Lin"}],["meta",{"property":"article:tag","content":"Python"}],["meta",{"property":"article:tag","content":"Context Management"}],["meta",{"property":"article:published_time","content":"2021-01-02T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-09-15T10:59:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Context Management in Python\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2021-01-02T00:00:00.000Z\\",\\"dateModified\\":\\"2024-09-15T10:59:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Yu-Kai Lin\\",\\"url\\":\\"https://stephlin.github.io\\"}]}"]]},"headers":[{"level":2,"title":"單一檔案存取","slug":"單一檔案存取","link":"#單一檔案存取","children":[]},{"level":2,"title":"使用 contextlib","slug":"使用-contextlib","link":"#使用-contextlib","children":[{"level":3,"title":"Case Study #1: 包裝函數","slug":"case-study-1-包裝函數","link":"#case-study-1-包裝函數","children":[]},{"level":3,"title":"Case Study #2: 轉導 stdout 到檔案流","slug":"case-study-2-轉導-stdout-到檔案流","link":"#case-study-2-轉導-stdout-到檔案流","children":[]},{"level":3,"title":"Case Study #3: 複數資源管理 ExitStack","slug":"case-study-3-複數資源管理-exitstack","link":"#case-study-3-複數資源管理-exitstack","children":[]}]},{"level":2,"title":"資源管理的深層應用","slug":"資源管理的深層應用","link":"#資源管理的深層應用","children":[]},{"level":2,"title":"結論","slug":"結論","link":"#結論","children":[]},{"level":2,"title":"References","slug":"references","link":"#references","children":[]}],"git":{"createdTime":1726397967000,"updatedTime":1726397967000,"contributors":[{"name":"Yu-Kai Lin","email":"stephen359595@gmail.com","commits":1}]},"readingTime":{"minutes":5.85,"words":1755},"filePathRelative":"posts/Python/Context-management.md","localizedDate":"January 2, 2021","excerpt":"<p>在執行程式的時候通常會需要存取資源，一般來說資源的來源可能是檔案、遠端連線、或是某種 Socket。當程式在調用資源的時候基本上包含兩個動作：</p>\\n<ul>\\n<li>請求資源使用權 (以檔案來說就是讀或寫之類的)、以及</li>\\n<li>釋放資源使用權。</li>\\n</ul>\\n<p>本篇我們將整理在 Python 中面對資源存取問題時，透過 <code>with</code> 的常見作法、其物件意涵、以及內建套件 <code>contextlib</code> 的一些使用時機。</p>\\n<h2>單一檔案存取</h2>\\n<p>假設我們有一個檔案 <code>input.txt</code>：</p>","autoDesc":true}`);export{C as comp,E as data};