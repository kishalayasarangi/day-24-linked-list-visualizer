let list = [];
let ops = 0;

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function addLog(msg, cls) {
  const logList = document.getElementById('logList');
  logList.querySelectorAll('.log-empty').forEach(e => e.remove());
  const li = document.createElement('li');
  li.className = `log-item ${cls}`;
  li.innerHTML = `<span>${msg}</span><span class="log-time">${getTime()}</span>`;
  logList.insertBefore(li, logList.firstChild);
}

function render(highlightIdx = -1, highlightClass = '') {
  const wrap = document.getElementById('listWrap');
  if (list.length === 0) {
    wrap.innerHTML = '<div class="empty-state">List is empty — insert a node to begin!</div>';
    return;
  }

  wrap.innerHTML = '';

  // HEAD label
  const headLabel = document.createElement('div');
  headLabel.style.cssText = 'font-size:0.7rem;color:#10b981;font-weight:600;margin-right:6px;';
  headLabel.textContent = 'HEAD';
  wrap.appendChild(headLabel);

  const arrow0 = document.createElement('div');
  arrow0.className = 'arrow';
  arrow0.textContent = '→';
  wrap.appendChild(arrow0);

  list.forEach((val, i) => {
    const group = document.createElement('div');
    group.className = 'node-group';

    const node = document.createElement('div');
    node.className = 'node';
    if (i === 0) node.classList.add('head-node');
    if (i === list.length - 1) node.classList.add('tail-node');
    if (i === highlightIdx && highlightClass) node.classList.add(highlightClass);

    node.innerHTML = `
      <div class="node-data">${val}</div>
      <div class="node-ptr">${i < list.length - 1 ? `next →` : 'next'}</div>
    `;

    group.appendChild(node);

    if (i < list.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      arrow.textContent = '→';
      group.appendChild(arrow);
    }

    wrap.appendChild(group);
  });

  const arrowNull = document.createElement('div');
  arrowNull.className = 'arrow';
  arrowNull.textContent = '→';
  wrap.appendChild(arrowNull);

  const nullNode = document.createElement('div');
  nullNode.className = 'null-node';
  nullNode.textContent = 'NULL';
  wrap.appendChild(nullNode);

  updateStats();
}

function updateStats() {
  document.getElementById('listSize').textContent = list.length;
  document.getElementById('listHead').textContent = list.length > 0 ? list[0] : '—';
  document.getElementById('listTail').textContent = list.length > 0 ? list[list.length - 1] : '—';
  document.getElementById('listOps').textContent = ops;
}

function insertHead() {
  const val = document.getElementById('insertVal').value.trim();
  if (!val) { alert('Enter a value!'); return; }
  list.unshift(val);
  ops++;
  render();
  addLog(`Inserted "${val}" at head`, 'insert');
  document.getElementById('insertVal').value = '';
}

function insertTail() {
  const val = document.getElementById('insertVal').value.trim();
  if (!val) { alert('Enter a value!'); return; }
  list.push(val);
  ops++;
  render();
  addLog(`Inserted "${val}" at tail`, 'insert');
  document.getElementById('insertVal').value = '';
}

function insertAt() {
  const val = document.getElementById('insertVal').value.trim();
  const pos = parseInt(document.getElementById('insertPos').value);
  if (!val) { alert('Enter a value!'); return; }
  if (isNaN(pos) || pos < 0 || pos > list.length) {
    addLog(`Invalid position ${pos}. Must be between 0 and ${list.length}`, 'error');
    return;
  }
  list.splice(pos, 0, val);
  ops++;
  render(pos, 'found-node');
  addLog(`Inserted "${val}" at position ${pos}`, 'insert');
  document.getElementById('insertVal').value = '';
  document.getElementById('insertPos').value = '';
}

function deleteByVal() {
  const val = document.getElementById('deleteVal').value.trim();
  if (!val) { alert('Enter a value!'); return; }
  const idx = list.indexOf(val);
  if (idx === -1) {
    addLog(`"${val}" not found in list`, 'error');
    return;
  }
  list.splice(idx, 1);
  ops++;
  render();
  addLog(`Deleted "${val}" from position ${idx}`, 'delete');
  document.getElementById('deleteVal').value = '';
}

function deleteByPos() {
  const pos = parseInt(document.getElementById('deletePos').value);
  if (isNaN(pos) || pos < 0 || pos >= list.length) {
    addLog(`Invalid position ${pos}. Must be between 0 and ${list.length - 1}`, 'error');
    return;
  }
  const val = list[pos];
  list.splice(pos, 1);
  ops++;
  render();
  addLog(`Deleted "${val}" from position ${pos}`, 'delete');
  document.getElementById('deletePos').value = '';
}

function searchNode() {
  const val = document.getElementById('searchVal').value.trim();
  if (!val) { alert('Enter a value!'); return; }
  const idx = list.indexOf(val);
  ops++;
  if (idx !== -1) {
    render(idx, 'found-node');
    addLog(`Found "${val}" at position ${idx}`, 'search');
  } else {
    render(-1, '');
    addLog(`"${val}" not found in list`, 'error');
  }
  document.getElementById('searchVal').value = '';
}

function clearList() {
  list = [];
  render();
  addLog('List cleared', 'delete');
}

document.getElementById('insertVal').addEventListener('keydown', e => {
  if (e.key === 'Enter') insertTail();
});

window.onload = () => render();