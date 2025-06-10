
    <script>
        // Переключение вкладок
        function openTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
            event.currentTarget.classList.add('active');
        }

        // Генерация графика 2/2
        function generate2x2Schedule() {
            const startDate = new Date(document.getElementById("start-date-2x2").value);
            const teamSize = parseInt(document.getElementById("team-size-2x2").value);
            const daysCount = parseInt(document.getElementById("days-count-2x2").value);
            const viewMode = document.getElementById("view-mode-2x2").value;
            
            if (!startDate || isNaN(teamSize) || isNaN(daysCount)) {
                alert("Пожалуйста, заполните все поля корректно!");
                return;
            }

            if (viewMode === "calendar") {
                generate2x2Calendar(startDate, daysCount);
            } else {
                generate2x2Table(startDate, teamSize, daysCount);
            }
        }

        function generate2x2Table(startDate, teamSize, daysCount) {
            let html = `<h3>График 2/2 на ${daysCount} дней</h3><table>
                        <tr><th>Дата</th>${Array.from({length: teamSize}, (_, i) => `<th>Работник ${i+1}</th>`).join('')}</tr>`;

            for (let day = 0; day < daysCount; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + day);
                
                const dateStr = currentDate.toLocaleDateString();
                const workers = [];
                
                for (let worker = 0; worker < teamSize; worker++) {
                    // Для 4 бригад: первые две работают первые 2 дня, вторые две - следующие 2 дня
                    const cycleDay = Math.floor(day / 2) % (teamSize / 2);
                    const isWorking = (worker % (teamSize / 2)) === cycleDay;
                    
                    workers.push(`<td class="${isWorking ? 'work-2x2' : 'off-2x2'}">${isWorking ? 'Работа' : 'Отдых'}</td>`);
                }
                
                html += `<tr><td>${dateStr}</td>${workers.join('')}</tr>`;
            }
            
            html += '</table>';
            document.getElementById("schedule-result-2x2").innerHTML = html;
        }

        function generate2x2Calendar(startDate, daysCount) {
            const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
            let html = `<h3>Календарь графика 2/2</h3><div class="calendar">`;
            
            // Заголовки дней недели
            weekdays.forEach(day => {
                html += `<div class="calendar-day" style="background: rgba(255,255,255,0.1); font-weight: bold;">${day}</div>`;
            });

            // Определяем день недели для первой даты
            const firstDay = startDate.getDay();
            // Корректировка для Пн=0, Вс=6
            const offset = firstDay === 0 ? 6 : firstDay - 1;
            
            // Пустые ячейки для выравнивания
            for (let i = 0; i < offset; i++) {
                html += `<div class="calendar-day"></div>`;
            }

            // Заполняем календарь
            for (let day = 0; day < daysCount; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + day);
                
                const dayNumber = currentDate.getDate();
                const diffDays = Math.floor((currentDate - startDate) / (86400000));
                const dayInCycle = (diffDays % 4 + 4) % 4; // 0-1 рабочие, 2-3 выходные
                const isWorkDay = dayInCycle < 2;
                
                html += `
                    <div class="calendar-day ${isWorkDay ? 'work-2x2' : 'off-2x2'}">
                        <div class="calendar-day-number">${dayNumber}</div>
                        <div class="calendar-day-status">${isWorkDay ? 'Работа' : 'Отдых'}</div>
                    </div>
                `;
            }
            
            html += '</div>';
            document.getElementById("schedule-result-2x2").innerHTML = html;
        }

        // Генерация графика День-Ночь-48
        function generateDN48Schedule() {
            const startDate = new Date(document.getElementById("start-date-dn48").value);
            const teamSize = parseInt(document.getElementById("team-size-dn48").value);
            const daysCount = parseInt(document.getElementById("days-count-dn48").value);
            const viewMode = document.getElementById("view-mode-dn48").value;
            
            if (!startDate || isNaN(teamSize) || isNaN(daysCount)) {
                alert("Пожалуйста, заполните все поля корректно!");
                return;
            }

            if (viewMode === "calendar") {
                generateDN48Calendar(startDate, daysCount);
            } else {
                generateDN48Table(startDate, teamSize, daysCount);
            }
        }

        function generateDN48Table(startDate, teamSize, daysCount) {
            let html = `<h3>График День-Ночь-48 на ${daysCount} дней</h3><table>
                        <tr><th>Дата</th>${Array.from({length: teamSize}, (_, i) => `<th>Работник ${i+1}</th>`).join('')}</tr>`;

            for (let day = 0; day < daysCount; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + day);
                
                const dateStr = currentDate.toLocaleDateString();
                const workers = [];
                
                for (let worker = 0; worker < teamSize; worker++) {
                    const totalDays = day - worker; // Сдвиг начала для каждой бригады
                    if (totalDays < 0) {
                        workers.push('<td>-</td>');
                        continue;
                    }
                    
                    const cyclePos = totalDays % 4;
                    let shift, className;
                    if (cyclePos === 0) {
                        shift = 'День';
                        className = 'day-dn48';
                    } else if (cyclePos === 1) {
                        shift = 'Ночь';
                        className = 'night-dn48';
                    } else {
                        shift = 'Отдых';
                        className = 'rest-dn48';
                    }
                    
                    workers.push(`<td class="${className}">${shift}</td>`);
                }
                
                html += `<tr><td>${dateStr}</td>${workers.join('')}</tr>`;
            }
            
            html += '</table>';
            document.getElementById("schedule-result-dn48").innerHTML = html;
        }

        function generateDN48Calendar(startDate, daysCount) {
            const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
            let html = `<h3>Календарь графика День-Ночь-48</h3><div class="calendar">`;
            
            // Заголовки дней недели
            weekdays.forEach(day => {
                html += `<div class="calendar-day" style="background: rgba(255,255,255,0.1); font-weight: bold;">${day}</div>`;
            });

            // Определяем день недели для первой даты
            const firstDay = startDate.getDay();
            // Корректировка для Пн=0, Вс=6
            const offset = firstDay === 0 ? 6 : firstDay - 1;
            
            // Пустые ячейки для выравнивания
            for (let i = 0; i < offset; i++) {
                html += `<div class="calendar-day"></div>`;
            }

            // Заполняем календарь
            for (let day = 0; day < daysCount; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + day);
                
                const dayNumber = currentDate.getDate();
                const diffDays = Math.floor((currentDate - startDate) / (86400000));
                const cyclePos = diffDays % 4;
                
                let shift, className;
                if (cyclePos === 0) {
                    shift = 'День';
                    className = 'day-dn48';
                } else if (cyclePos === 1) {
                    shift = 'Ночь';
                    className = 'night-dn48';
                } else {
                    shift = 'Отдых';
                    className = 'rest-dn48';
                }
                
                html += `
                    <div class="calendar-day ${className}">
                        <div class="calendar-day-number">${dayNumber}</div>
                        <div class="calendar-day-status">${shift}</div>
                    </div>
                `;
            }
            
            html += '</div>';
            document.getElementById("schedule-result-dn48").innerHTML = html;
        }

        // Генерация графика 3/1
        function generate3x1Schedule() {
            const startDate = new Date(document.getElementById("start-date-3x1").value);
            const teamSize = parseInt(document.getElementById("team-size-3x1").value);
            const daysCount = parseInt(document.getElementById("days-count-3x1").value);
            const viewMode = document.getElementById("view-mode-3x1").value;
            
            if (!startDate || isNaN(teamSize) || isNaN(daysCount)) {
                alert("Пожалуйста, заполните все поля корректно!");
                return;
            }

            if (viewMode === "calendar") {
                generate3x1Calendar(startDate, daysCount);
            } else {
                generate3x1Table(startDate, teamSize, daysCount);
            }
        }

        function generate3x1Table(startDate, teamSize, daysCount) {
            let html = `<h3>График 3/1 на ${daysCount} дней</h3><table>
                        <tr><th>Дата</th>${Array.from({length: teamSize}, (_, i) => `<th>Работник ${i+1}</th>`).join('')}</tr>`;

            for (let day = 0; day < daysCount; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + day);
                
                const dateStr = currentDate.toLocaleDateString();
                const workers = [];
                
                for (let worker = 0; worker < teamSize; worker++) {
                    const totalDays = day - worker; // Сдвиг начала для каждой бригады
                    if (totalDays < 0) {
                        workers.push('<td>-</td>');
                        continue;
                    }
                    
                    const cyclePos = totalDays % 4;
                    const isWorkDay = cyclePos < 3; // 0-2 рабочие, 3 выходной
                    
                    workers.push(`<td class="${isWorkDay ? 'work-3x1' : 'off-3x1'}">${isWorkDay ? 'Работа' : 'Отдых'}</td>`);
                }
                
                html += `<tr><td>${dateStr}</td>${workers.join('')}</tr>`;
            }
            
            html += '</table>';
            document.getElementById("schedule-result-3x1").innerHTML = html;
        }

        function generate3x1Calendar(startDate, daysCount) {
            const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
            let html = `<h3>Календарь графика 3/1</h3><div class="calendar">`;
            
            // Заголовки дней недели
            weekdays.forEach(day => {
                html += `<div class="calendar-day" style="background: rgba(255,255,255,0.1); font-weight: bold;">${day}</div>`;
            });

            // Определяем день недели для первой даты
            const firstDay = startDate.getDay();
            // Корректировка для Пн=0, Вс=6
            const offset = firstDay === 0 ? 6 : firstDay - 1;
            
            // Пустые ячейки для выравнивания
            for (let i = 0; i < offset; i++) {
                html += `<div class="calendar-day"></div>`;
            }

            // Заполняем календарь
            for (let day = 0; day < daysCount; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + day);
                
                const dayNumber = currentDate.getDate();
                const diffDays = Math.floor((currentDate - startDate) / (86400000));
                const cyclePos = diffDays % 4;
                const isWorkDay = cyclePos < 3; // 0-2 рабочие, 3 выходной
                
                html += `
                    <div class="calendar-day ${isWorkDay ? 'work-3x1' : 'off-3x1'}">
                        <div class="calendar-day-number">${dayNumber}</div>
                        <div class="calendar-day-status">${isWorkDay ? 'Работа' : 'Отдых'}</div>
                    </div>
                `;
            }
            
            html += '</div>';
            document.getElementById("schedule-result-3x1").innerHTML = html;
        }

        // Установка текущей даты по умолчанию
        document.addEventListener("DOMContentLoaded", function() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById("start-date-2x2").value = today;
            document.getElementById("start-date-dn48").value = today;
            document.getElementById("start-date-3x1").value = today;
            
            // Генерация примеров графиков при загрузке
            generate2x2Schedule();
            generateDN48Schedule();
            generate3x1Schedule();
        });
    </script>