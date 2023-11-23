import { HomePage } from '../support/Pages/homePage';
import { FormUtilsPage } from '../support/Pages/formUtilsPage';


describe('Testing alerts Page', () => {
    const homePage = new HomePage;
    const formUtils = new FormUtilsPage;
    const numeroRandom = Math.floor(Math.random() * 9999 );
    const username = `usuariotest${numeroRandom}`;
    let userData
    

    before('', () => {
        cy.fixture('userData').then(varData => {
            userData = varData;
        });
        
    });


    beforeEach('', () => {
        cy.request({
            mehod : "DELETE",
            url : `https://pushing-it.onrender.com/api/deleteuser/${username}`,
            failOnStatusCode : false
        }).then(respuestaDelete => {
            cy.log(respuestaDelete.body);
        })

        cy.request({
            url : 'https://pushing-it.onrender.com/api/register',
            method : "POST",
            body : {
                username: username,
                password : userData.register.password,
                gender : userData.register.gender,
                day : userData.register.day,
                month : userData.register.month,
                year : userData.register.year            
                   }
            }).then(respuestaRegister => {
                expect(respuestaRegister.status).to.be.equal(200);
        });

         cy.request({
             url : "https://pushing-it.onrender.com/api/login",
             method: "POST",
             body : {
                 username : username,
                 password : userData.register.password
             }
         }).then(respuestaLogin => {
             cy.log(respuestaLogin.body);
             window.localStorage.setItem('token', respuestaLogin.body.token);
             window.localStorage.setItem('user', respuestaLogin.body.user);
             cy.visit('');
             homePage.clickeaForms()
         })
    });
    
    it('Testing FormUtils - Slices', () => {
        formUtils.clickeaShowDataPicker();
        formUtils.clickeaDataPicker();
        formUtils.modifyDataPicker(userData.date);
        formUtils.getNewDate().should('exist')
    });
});