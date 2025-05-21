function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('explore_button').addEventListener('click', async function() {
  document.getElementById('page1').classList.add('rotate-away');
  let page2 = document.getElementById('page2');
  await sleep(1000)
  page2.classList.add('rotate-in');
});