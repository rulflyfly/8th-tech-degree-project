const swap = (arr) => {
    const holder = [];
    holder.push(arr[1]);
    holder.push(arr[2]);
    holder.push(arr[0].substring(2));
    
    return holder.join('/');
};

const formatState = (data) => {
    return abbr = stateAbbreviations.reduce((abbr, state) => {
        if (state.name === data) {
            abbr = state.abbreviation;
        }
        return abbr;
    }, '')
};


const formatDate = (date) => {
    const dateArr = date.split('');
    let t = false;
    const deleteTail = dateArr.reduce((newDate, char) => {
        if (char === 'T') {
            t = true;
        } 
        if (!t) {
            newDate.push(char);
        }
            return newDate;
    }, []);
    const swapYear = deleteTail.join('').split('-');
    return swap(swapYear);
};

const getInfo = (employees) => {
    employees.forEach((employee, index) => {
        const $card = $('<div class="card"></div>');
        $card.addClass(`person-${index + 1}`);

        const $info = $('<div class="info"></div>');
        const $moreInfo = $('<div class="more-info"></div>');
        
        const img = `<img src="${employee.picture.large}" alt="a picture of the employee">`;
        const name = `<h3>${employee.name.first} ${employee.name.last}</h3>`;
        const email = `<p>${employee.email}</p>`;
        const city = `<p>${employee.location.city}</p>`;
        const $line = $('<div class="more-info line"></div>');
        const phone = `<p>${employee.phone}</p>`;
        const abbr = formatState(employee.location.state);
        const adress = `<p>${employee.location.street.number} ${employee.location.street.name}, ${abbr} ${employee.location.postcode}</p>`;
        const date = formatDate(employee.dob.date);
        const birthday = `<p>Birthday: ${date}</p>`;

        $info.append(name, email, city);
        $moreInfo.append($line, phone, adress, birthday);
        $card.append(img, $info, $moreInfo);
        $('.wrapper').append($card);
     }, 0)

     $('.card .more-info').css('display', 'none');
};


const getCards = (json) => {
      const employees = json.results;
      getInfo(employees);
      return '.card';
};

const scroll = () => {
    var y = document.scrollingElement.scrollTop;
    return y;
};


const openInfo = (clicked) => {
    const $card = $('<div class="open"></div>');
    const $overlay = $('<div class="overlay"></div>');
    const $hide = $('<div class=hide>x</div>');



    $card.html($(clicked).html());
    $card.prepend($hide);

    $hide.on('click', () => {
        $('.clicked').removeClass('clicked');
        $('.open').remove();
        $('.overlay').remove();
        $('body').css('overflow', 'unset');
      })

    $('body').append($overlay, $card);
};


const openCard = (cards) => {
    $(cards).on('click', (e) => {

        //making sure we select a card div

        if ($(e.target.parentNode.parentNode).hasClass('card')) {
            $(e.target.parentNode.parentNode).addClass('clicked');
        }
        if ($(e.target.parentNode).hasClass('card')) {
            $(e.target.parentNode).addClass('clicked')
        }
        if ($(e.target).hasClass('card')) {
            $(e.target).addClass('clicked')
        }
        
        //creating a new overlay div
        
        const offset = scroll();

        openInfo($('.clicked'));
        $('.open .more-info').css('display', 'block');
        $('.open').css('top', offset + 100);
        $('body').css('overflow', 'hidden');


    })
};


fetch('https://randomuser.me/api/?results=12&nat=us&dob.date[0]=1')
   .then(response => response.json())
   .then(getCards)
   .then(openCard)
  
   
  

   
