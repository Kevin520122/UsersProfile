
// Write Javascript code!
const Api = (() => {
  //const baseUrl = "https://jsonplaceholder.typicode.com";
  const baseUrl = 'https://randomuser.me/api';

  //This API generates random User data each call
  const getUser = () => fetch(baseUrl).then((response) => response.json());

  return {
    getUser,
  };
})();

// * ~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~
const View = (() => {
  const domstr = {
    dob: '.dob',
  };

  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };

  const createTmp = (arr) => {
    let tmp = '';

    arr.forEach((user) => {
      if(user.isShow){
        tmp += `<li>
          <div class="card">
            <div class="img">
              <img src="${user.img}">
            </div>
            <div class="info">
              <p>name: ${user.name}<br>
              email: ${user.email}<br>
              phone: ${user.phone}</p>
              <div class="birth" id=${user.id}>
                Birthday: ${user.birthday}
              </div>
            </div>
          </div>
        </li>`;
      }else{
        tmp += `<li>
                  <div class="card">
                    <div class="img">
                      <img src="${user.img}">
                    </div>
                    <div class="info">
                      <p>name: ${user.name}<br>
                      email: ${user.email}<br>
                      phone: ${user.phone}</p>
                      <button class="dob" id=${user.id}>Show Birthday</button>
                    </div>
                  </div>
                </li>`;
      }
    });

    return tmp;
  };

  return {
    render,
    createTmp,
    domstr,
  };
})();

// * ~~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
  const { getUser } = api;

  class User {
    constructor(name, phone, email, birthday, img) {
      this.name = name;
      this.phone = phone;
      this.email = email;
      this.birthday = birthday;
      this.img = img;
      this.id = this.generateRandomId();
      this.isShow = false;
    }

    generateRandomId = () => {
      const resouse =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';

      const length = 12;
      let id = '';
      for (let i = 0; i <= length; i++) {
        const index = Math.floor(Math.random() * resouse.length);
        id += resouse[index];
      }
      return id;
    };
  }

  class State {
    #users = [];

    get users() {
      return this.#users;
    }
    set users(newusers) {
      this.#users = newusers;

      const usersList = document.getElementById('user_list');
      // //Create new todo html
      const tmp = view.createTmp(this.#users);
      // //Re-render the page
      view.render(usersList, tmp);
    }

    updateUsers(index, updated_user){
      this.#users[index] = updated_user;
      const usersList = document.getElementById('user_list');
      // //Create new todo html
      const tmp = view.createTmp(this.#users);
      // //Re-render the page
      view.render(usersList, tmp);
    }
  }

  return {
    getUser,
    State,
    User,
  };
})(Api, View);

// * ~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
  const state = new model.State();
  const init = async () => {
    let users = [];
    for (let i = 0; i < 20; i++) {
      await model.getUser().then((user) => {
        const res = user.results[0];
        const name = res.name.first + ' ' + res.name.last;
        const newUser = new model.User(
          name,
          res.phone,
          res.email,
          res.dob.date,
          res.picture.medium
        );
        users.push(newUser);
      });
    }
  
    state.users = users;
    //Approach 2
    // let promises = []
    // for (let i = 0; i < 20; i++) {
    //   await promises.push(model.getUser())
    // }

    // Promise.all(promises).then((users) => {
    //   })
    // })

  };

  const showBirthday = () => {
    const user_list = document.getElementById("user_list");
    //console.log(birthday_btn)
    user_list.addEventListener('click', (e) => {
      if(e.target.className === "dob" || e.target.className === "birth"){
        //const btn = document.getElementById(e.target.id)
        let aim = state.users.find((user) => user.id === e.target.id);
        const index = state.users.indexOf(aim);
        //btn.style.display = "none";
        aim.isShow = !aim.isShow;
        state.updateUsers(index, aim);
      }

      
    });
  };

  const reload = () => {
   const reload_btn = document.getElementById("reload");
   reload_btn.addEventListener("click", (e) => {
     location.reload()
   })
  }

  const bootstrap = () => {
    init();
    showBirthday();
    reload();
  };

  return { bootstrap };
})(Model, View);

Controller.bootstrap();
