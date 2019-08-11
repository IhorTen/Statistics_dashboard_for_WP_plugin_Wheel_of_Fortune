(function ( $ ) {
    $(document).ready(function() {
        $('.update-nag').hide();

        let website_ajax_url = 'https://88ace.club/wp-admin/admin-ajax.php';
        let statPointsTest = [];
        let statPointsReal = [];
        let sumTestClick = 0;
        let sumRealClick = 0;
        let sumWatsAppClick = 0;

        daterange();
        dropdownMenu();
        getStatData('last_week');

        ///////////////ADD STAT POINTS/////////////
        function addStatPoints(data) {
            let point;
            statPointsTest = [];
            statPointsReal = [];
            for (let i = 0; i < data.length; i++){
                point = new Date(data[i].date_of_task);
                statPointsTest.push({
                    x: point,
                    y: data[i].status_1
                });
                statPointsReal.push({
                    x: point,
                    y: data[i].status_2
                });
            }
        }

        /////////////SUM TEST REAL WATSAAP CLICK////////////
        function sumClickButton(data) {
            sumTestClick = 0;
            sumRealClick = 0;
            sumWatsAppClick = 0;
            for (let i = 0; i < data.length; i++){
                sumTestClick += data[i].status_1;
                sumRealClick += data[i].status_2;
                sumWatsAppClick += data[i].status_3;
            }
            sumRealClick += sumWatsAppClick;
            console.log('Test Click', sumTestClick);
            console.log('Real Click', sumRealClick);
            console.log('WatsApp Click', sumWatsAppClick);

        }

        //////////////// CALENDAR DATE ///////////////
        function calendarDate(data) {
            $('input[name="daterange"]')[0].value = `${data[0].date_of_task.substr(0,10).replace(/-/g, '/')} - ${data[data.length - 1].date_of_task.substr(0,10).replace(/-/g, '/')}`;
        }

        ///////////////Get Statistics Data///////////////
        function getStatData (period) {
            $.ajax({
                url: `${website_ajax_url}`,
                type: "GET",
                data: {
                    action: "wos_get_stats_period",
                    period: period
                },
                success: function (response) {
                    if (response.success) {
                        console.log(response.success);
                        switch (period) {
                            case 'today':
                                addStatPoints(response.success);
                                sumClickButton(response.success);
                                statistics('hour', 2, 'HH', statPointsTest, statPointsReal, 'Today');
                                statistics_bar(sumTestClick, sumRealClick, sumWatsAppClick);
                                calendarDate(response.success);
                                break;
                            case 'yesterday':
                                addStatPoints(response.success);
                                sumClickButton(response.success);
                                statistics('hour', 2, 'HH', statPointsTest, statPointsReal, 'Yesterday');
                                statistics_bar(sumTestClick, sumRealClick, sumWatsAppClick);
                                calendarDate(response.success);
                                break;
                            case 'last_week':
                                addStatPoints(response.success);
                                sumClickButton(response.success);
                                statistics('day', 1, 'DD', statPointsTest, statPointsReal, 'Last Week');
                                statistics_bar(sumTestClick, sumRealClick, sumWatsAppClick);
                                calendarDate(response.success);
                                break;
                            case 'this_month':
                                addStatPoints(response.success);
                                sumClickButton(response.success);
                                statistics('day', 2,'DD', statPointsTest, statPointsReal, 'This Month');
                                statistics_bar(sumTestClick, sumRealClick, sumWatsAppClick);
                                calendarDate(response.success);
                                break;
                            case 'last_month':
                                addStatPoints(response.success);
                                sumClickButton(response.success);
                                statistics('day', 2,'DD', statPointsTest, statPointsReal, 'Last Month');
                                statistics_bar(sumTestClick, sumRealClick, sumWatsAppClick);
                                calendarDate(response.success);
                                break;
                            case 'lifetime':
                                addStatPoints(response.success);
                                sumClickButton(response.success);
                                statistics('month', 1,'MMM', statPointsTest, statPointsReal, 'Lifetime');
                                statistics_bar(sumTestClick, sumRealClick, sumWatsAppClick);
                                calendarDate(response.success);
                                break;
                        }
                    }

                },
                error: function (error) {
                    console.log(error)
                }
            });
        }

        /////////////////////STATISTICS//////////////////
        function statistics(intervalType, interval,dateFormat, statPointsTest, statPointsReal, name) {
            // window.onload = function () {
            // };
            let chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                animationDuration: 2000,
                theme: "light2",
                backgroundColor: "#fff",
                title:{
                    text: `Report: ${name}`,
                    fontFamily : 'verdana',
                    fontSize: 20,
                    fontWeight: 'bold',
                    margin : 15
                },
                axisX: {
                    interval: interval,
                    intervalType: intervalType,
                    valueFormatString: dateFormat
                },
                // axisY:{
                //     includeZero: false,
                // },
                data: [{
                    type: "spline",
                    name: "Test Spin",
                    showInLegend: true,
                    markerSize: 1,
                    color: "#fa5a8b",
                    lineThickness: 3,
                    markerColor:'#fa5a8b',
                    markerBorderColor:'#fa5a8b',
                    dataPoints: statPointsTest
                },
                    {
                        type: "splineArea",
                        name: "Real Spin",
                        showInLegend: true,
                        markerSize: 0,
                        color: "#0a9bff",
                        lineColor: "#0a9bff",
                        lineThickness: 1,
                        fillOpacity: .3,
                        markerColor:'#0a9bff',
                        dataPoints: statPointsReal
                    }
                ]
            });
            chart.render();
        }

        function statistics_bar(testClick, realClick, watsAppClick) {
            $('.wa_val').empty();
            let chart = new CanvasJS.Chart("chartContainer_bar", {
                animationEnabled: true,
                animationDuration: 2000,
                title:{
                    text: "Overviews",
                    fontFamily : 'verdana',
                    fontSize: 20,
                    fontWeight: 'bold'
                },
                data: [
                    {
                        type: "doughnut",
                        dataPoints: [
                            {  y:
                                testClick,
                                indexLabel: (testClick === 0) ? "" : "Test Spin",
                                color: '#fa5a8b' },
                            {  y:
                                realClick,
                                indexLabel: (realClick === 0) ? "" : "Real Spin",
                                color: "#0a9bff" },
                            {  y:
                                watsAppClick,
                                indexLabel: (watsAppClick === 0) ? "" : "Wats App",
                                color: '#53c678' },
                        ]
                    }
                ]
            });
            chart.render();
            $('.page_val').html(testClick);
            $('.unique_val').html(realClick);
            $('.wa_val').html(watsAppClick);

        }

        /////////////////////DROPDOWN//////////////////
        function dropdownMenu() {
            let x, i, j, selElmnt, a, b, c;
            /*look for any elements with the class "dropdown-select":*/
            x = document.getElementsByClassName("dropdown-select");
            for (i = 0; i < x.length; i++) {
                selElmnt = x[i].getElementsByTagName("select")[0];
                /*for each element, create a new DIV that will act as the selected item:*/
                a = document.createElement("DIV");
                a.setAttribute("class", "select-selected");
                // a.setAttribute("value", selElmnt.value);
                a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                x[i].appendChild(a);
                /*for each element, create a new DIV that will contain the option list:*/
                b = document.createElement("DIV");
                b.setAttribute("class", "select-items select-hide");
                for (j = 1; j < selElmnt.length; j++) {
                    /*for each option in the original select element,
                    create a new DIV that will act as an option item:*/
                    c = document.createElement("DIV");
                    c.innerHTML = selElmnt.options[j].innerHTML;
                    c.setAttribute('value' , selElmnt.options[j].value);
                    c.addEventListener("click", function() {
                        getStatData($(this)[0].getAttribute('value').toString());
                        /*when an item is clicked, update the original select box,
                        and the selected item:*/
                        let y, i, k, s, h;
                        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                        h = this.parentNode.previousSibling;
                        for (i = 0; i < s.length; i++) {
                            if (s.options[i].innerHTML == this.innerHTML) {
                                s.selectedIndex = i;
                                h.innerHTML = this.innerHTML;
                                y = this.parentNode.getElementsByClassName("same-as-selected");
                                for (k = 0; k < y.length; k++) {
                                    y[k].removeAttribute("class");
                                }
                                this.setAttribute("class", "same-as-selected");
                                break;
                            }
                        }
                        h.click();
                    });
                    b.appendChild(c);
                }
                x[i].appendChild(b);
                a.addEventListener("click", function(e) {
                    /*when the select box is clicked, close any other select boxes,
                    and open/close the current select box:*/
                    e.stopPropagation();
                    closeAllSelect(this);
                    this.nextSibling.classList.toggle("select-hide");
                    this.classList.toggle("select-arrow-active");
                });
            }
            function closeAllSelect(elmnt) {
                /*a function that will close all select boxes in the document,
                except the current select box:*/
                let x, y, i, arrNo = [];
                x = document.getElementsByClassName("select-items");
                y = document.getElementsByClassName("select-selected");
                for (i = 0; i < y.length; i++) {
                    if (elmnt == y[i]) {
                        arrNo.push(i)
                    } else {
                        y[i].classList.remove("select-arrow-active");
                    }
                }
                for (i = 0; i < x.length; i++) {
                    if (arrNo.indexOf(i)) {
                        x[i].classList.add("select-hide");
                    }
                }
            }
            /*if the user clicks anywhere outside the select box,
            then close all select boxes:*/
            document.addEventListener("click", closeAllSelect);
        }

        /////////////////////DATERANGE//////////////////
        function daterange() {
            $('input[name="daterange"]').daterangepicker({
                opens: 'center',
                locale: {
                    format: 'YYYY/MM/DD'
                }
            }, function(start, end, label) {
                console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                $.ajax({
                    url: `${website_ajax_url}`,
                    type: "GET",
                    data: {
                        action: "wos_get_stats_period",
                        from: start.format('YYYY-MM-DD'),
                        to: end.format('YYYY-MM-DD')
                    },
                    success: function (response) {
                        console.log(response.success);
                        if (response.success){
                            let intervalType,interval, dateFormat;
                            if (response.success.length <= 15 ) {
                                intervalType = 'day';
                                interval = 1;
                                dateFormat = 'DDD';
                            } else if ( response.success.length <= 30) {
                                intervalType = 'day';
                                interval = 2;
                                dateFormat = 'DD';
                            } else if (response.success.length <= 61 ) {
                                intervalType = 'day';
                                interval = 7;
                                dateFormat = 'DDD';
                            } else {
                                intervalType = 'month';
                                interval = 1;
                                dateFormat = 'MMM';
                            }
                            addStatPoints(response.success);
                            sumClickButton(response.success);
                            statistics(intervalType, interval, dateFormat, statPointsTest, statPointsReal,`from ${start.format('YYYY-MM-DD')} to ${end.format('YYYY-MM-DD')}`);
                            statistics_bar(sumTestClick, sumRealClick, sumWatsAppClick);
                        }
                    },
                    error: function (error) {
                        console.log(error)
                    }
                });
                $('select, .select-selected, .select-items').remove();
                $('.dropdown-select').append(`
                    <select>
                        <option value="0">Date selection</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="last_week">Last week</option>
                        <option value="this_month">This month</option>
                        <option value="last_month">Last month</option>
                        <option value="lifetime">Lifetime</option>
                    </select>
                `);

                dropdownMenu();
            });
        }



    })
})( jQuery );