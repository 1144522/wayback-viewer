<script>
  import { onMount } from "svelte";
  import { format } from "date-fns";
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import { lang, translations } from '$lib/i18n';

  let url = "";

  let isShare = false;
  let isFetching = false;

 /** @type {Array<Object>} 存储快照列表 */
  let snapshots = [];

  /** @type {Object|null} 当前选中的快照 */
  let selectedSnapshot = null;

  let content = "";
  let showRawHtml = false;

  onMount(() => {
    const original = $page.url.searchParams.get("original");
    const timestamp = $page.url.searchParams.get("timestamp");
    if (original) {
      url = original;
      if (timestamp) {
        const snapshot = { original, timestamp };
        fetchSnapshotContent(snapshot);
        isShare = true;
      } else {
        fetchSnapshots();
      }
    }
  });

  
  async function fetchSnapshots() {
    isShare = false;

    if (!url) {
      return;
    }

    isFetching = true;
    const response = await fetch(
      `/api/snapshots?url=${encodeURIComponent(url)}`,
    );
    if (response.ok) {
      snapshots = await response.json();
      if (snapshots.length > 0) {
        console.log(snapshots);
        const default_snapshot = getMaxLengthItem(snapshots);
        await fetchSnapshotContent(default_snapshot);
      }
    } else {
      alert(translations[$lang].fetchSnapshotsFailed);
      isFetching = false;
    }
  }

  async function fetchSnapshotContent(snapshot) {
    isFetching = true;
    selectedSnapshot = snapshot;
    const response = await fetch(
      `/api/snapshot-content?url=${encodeURIComponent(snapshot.original)}&timestamp=${snapshot.timestamp}`,
    );
    if (response.ok) {
      content = await response.text();
    } else {
      content = "获取快照内容失败";
    }
    isFetching = false;
  }

  function getMaxLengthItem(items) {
    return items.reduce((maxItem, currentItem) => {
      const maxItemLength = parseInt(maxItem.length, 10);
      const currentItemLength = parseInt(currentItem.length, 10);
      return currentItemLength > maxItemLength ? currentItem : maxItem;
    }, items[0]);
  }

  function getStatusText(statuscode) {
    if (statuscode === "404") return "不可访问";
    return "可访问";
  }

  function toggleRawHtml() {
    showRawHtml = !showRawHtml;
  }

  async function copyToClipboard(url) {
    await navigator.clipboard.writeText(url);
    alert(translations[$lang].linkCopied);
  }


  function generateShareUrl(snapshot) {
    const baseUrl = window.location.origin; 
    const shareUrl = `${baseUrl}?original=${snapshot.original}&timestamp=${snapshot.timestamp}`;
    copyToClipboard(shareUrl);
  }


  function toggleLanguage() {
    $lang = $lang === 'zh' ? 'en' : 'zh';
  }

  async function handle_submit() {
    if (isValidUrl(url)) {
      await fetchSnapshots();
    } else {
      alert(translations[$lang].invalidUrl);
    }
  }


  function isValidUrl(url) {
    const pattern = /^(https?:\/\/)?([\w\d.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
    return pattern.test(url);
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && isValidUrl(url)) {
      handle_submit();
    }
  }

  function goToHome() {
    goto('/');
  }
</script>

<header
  class="bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-900 dark:to-gray-800 text-white p-4 fixed top-0 left-0 right-0 z-50 shadow-lg"
>
<div class="container mx-auto flex justify-between items-center">
  <button
    on:click={goToHome}
    class="text-xl md:text-2xl font-bold tracking-wide hover:text-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
  >
    {translations[$lang].viewWebSnapshot}
  </button>
    <div class="flex items-center space-x-4">
      <button
        on:click={toggleLanguage}
        class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        {$lang === 'zh' ? 'EN' : '中文'}
      </button>
      <a
        href="https://github.com/youfun/wayback-viewer"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center hover:text-gray-300 transition duration-200"
      >
       
        <span class="hidden md:inline ml-2 font-medium">GitHub</span>
      </a>
    </div>
  </div>
</header>

<main class="container mx-auto p-4 flex flex-col mt-16 dark:bg-gray-800 dark:text-white">
  <div class="w-full mb-4">
    <div class="flex items-center">
      <input
        type="url"
        bind:value={url}
        id="website"
        placeholder={translations[$lang].inputPlaceholder}
        class="flex-grow p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mr-2"
        on:keydown={handleKeydown}
      />
      <button
        on:click={handle_submit}
        class="text-white px-4 py-2 rounded transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        class:bg-blue-500={!isShare && !isFetching}
        class:hover:bg-blue-600={!isShare && !isFetching}
        class:bg-green-500={isShare && !isFetching}
        class:hover:bg-green-600={isShare && !isFetching}
        class:bg-gray-500={isFetching}
        class:hover:bg-gray-600={isFetching}
        disabled={!isValidUrl(url) || isFetching}
      >
  {#if isFetching}

    {translations[$lang].gettingSnapshot}
  {:else}
    {translations[$lang].getSnapshot}
  {/if}
</button>
    </div>
  </div>

  

 
<div class="flex flex-col md:flex-row">
  <div class="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0">
    <h2 class="text-xl font-semibold mb-2">{translations[$lang].title}</h2>
    {#if isShare}
      <div class="p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
        <p class="mb-2">{translations[$lang].shareModeTip}</p>
        <button
          on:click={handle_submit}
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150 ease-in-out"
        >
          {translations[$lang].getOtherSnapshot}
        </button>
      </div>
    {:else}
      <div class="overflow-y-auto max-h-[calc(100vh-16rem)]">
        {#each snapshots as snapshot (snapshot.id)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          in:fade={{ duration: 300 }}
          class="p-2 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
          class:bg-blue-100={selectedSnapshot === snapshot}
          class:dark:bg-blue-900={selectedSnapshot === snapshot}
          on:click={() => fetchSnapshotContent(snapshot)}
        >
          <div>{snapshot.timestamp}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {getStatusText(snapshot.statuscode)}
          </div>
        </div>
      {/each}
      </div>
    {/if}
  </div>


    <div class="w-full md:w-2/3 md:pl-4">
      {#if selectedSnapshot}
        <h2 class="text-xl font-semibold mb-2">{translations[$lang].snapshotContent}</h2>
        <p class="mb-2">
          {translations[$lang].sourceFrom} <a
            href="https://archive.org"
            target="_blank"
            class="text-blue-500 hover:underline">Internet Archive</a
          >
        </p>

        <button
        class="mb-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition duration-150 ease-in-out"
        on:click={() => generateShareUrl(selectedSnapshot)}>{translations[$lang].share}</button
        >
        <div
          class="border p-4 rounded max-h-full overflow-auto dark:border-gray-700"
        >
          {#if content}
            <iframe
              srcdoc={content}
              class="w-full h-[calc(100vh-22rem)]"
              title="Snapshot content"
              sandbox="allow-scripts"
            ></iframe>
          {:else}
            <pre class="whitespace-pre-wrap break-words">{translations[$lang].noContent}</pre>
          {/if}
        </div>
      {:else}
        <p class="text-gray-600 dark:text-gray-400 italic">{translations[$lang].viewArea}</p>
      {/if}
    </div>
  </div>
</main>