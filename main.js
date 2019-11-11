//the date returned from the api is formated YYYY/MM/DD
//I needed MM/DD/YY that's what the next to functions about

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

//the date of birth returned from the api contained time of birth 
//I removed it 

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

//here I'm getting all the information from the api and putting it inside different DOM elements

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

//here I accessed a result property of the fetched json
//I need to return '.card' to chain the next then so that the passed to it function had '.card' as a parameter
const getCards = (json) => {
      const employees = json.results;
      getInfo(employees);
      return '.card';
};


//scroll top returns a number which reprecents how many pixels was scrolled from the top
//I need this to dynamically position opening cards
const scroll = () => {
    var y = document.scrollingElement.scrollTop;
    return y;
};

//generating an opening card
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

        $('.prev').css('display', 'none');
        $('.next').css('display', 'none');
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
            $(e.target.parentNode).addClass('clicked');
        }
        if ($(e.target).hasClass('card')) {
            $(e.target).addClass('clicked');
        }
        
        //creating a new overlay div
        
        const offset = scroll();

        openInfo($('.clicked'));
        $('.open .more-info').css('display', 'block');
        $('.open').css('top', offset + 100);
        $('body').css('overflow', 'hidden');

        $('.prev').css('display', 'block');
        $('.next').css('display', 'block');

        $('.prev').css('top', offset + 500);
        $('.prev').css('left', '40%');

        $('.next').css('top', offset + 500);
        $('.next').css('right', '40%');
    })
};


/*================================================
===========ARROWS FUNCTIONALITY===================
==================================================*/


const $next = $('.next');
const $prev = $('.prev');

$next.on('click', () => {
    const card = document.querySelector('.clicked').nextElementSibling;
    const offset = scroll();

    if (card) {
        $('.clicked').removeClass('clicked');
        $('.open').remove();
        $('.overlay').remove();
        $('body').css('overflow', 'unset');

        $('.prev').css('display', 'none');
        $('.next').css('display', 'none');

        openInfo(card);
        $('.open .more-info').css('display', 'block');
        $('.open').css('top', offset + 100);
        $('body').css('overflow', 'hidden');

        $('.prev').css('display', 'block');
        $('.next').css('display', 'block');

        $('.prev').css('top', offset + 500);
        $('.prev').css('left', '40%');

        $('.next').css('top', offset + 500);
        $('.next').css('right', '40%');

        $(card).addClass('clicked');
    }
       
})


$prev.on('click', () => {
    const card = document.querySelector('.clicked').previousElementSibling;
    const offset = scroll();

    if ($(card).hasClass('card')) {
        $('.clicked').removeClass('clicked');
        $('.open').remove();
        $('.overlay').remove();
        $('body').css('overflow', 'unset');

        $('.prev').css('display', 'none');
        $('.next').css('display', 'none');

        openInfo(card);
        $('.open .more-info').css('display', 'block');
        $('.open').css('top', offset + 100);
        $('body').css('overflow', 'hidden');

        $('.prev').css('display', 'block');
        $('.next').css('display', 'block');

        $('.prev').css('top', offset + 500);
        $('.prev').css('left', '40%');

        $('.next').css('top', offset + 500);
        $('.next').css('right', '40%');

        $(card).addClass('clicked');
    }
       
})


/*================================================
============SEARCH FUNCTIONALITY===================
==================================================*/

$('input').on('keyup', function(){
    const value = $(this).val().toLowerCase();
    $('.card h3').filter(function() {
        const $name = $(this).text().toLowerCase();
        $(this).parent().parent().toggle($name.indexOf(value) !== -1);
    });
});



/*=================================================
===========GETTING INFO FROM THE API===============
==================================================*/

fetch('https://randomuser.me/api/?results=12&nat=us&dob.date[0]=1')
   .then(response => response.json())
   .then(getCards)
   .then(openCard)
   .catch(err => {
       new Error(err);
       $('body').append('<h2 class="err">something went wrong :(</h2>');
       $('.err').css('width', '50%');
       $('.err').css('margin', '0 auto');
       $('.wrapper').css('display', 'none');
    });
  
   
  

   
