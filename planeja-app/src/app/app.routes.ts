import { Routes } from '@angular/router';
import { Template } from './template/template';
import { CadastroCartao } from './cartoes/cadastro-cartao/cadastro-cartao';
import { ListagemCartoes } from './cartoes/listagem-cartoes/listagem-cartoes';

export const routes: Routes = [
    {
        path: 'paginas',
        component: Template,
        children: [
            {
                path: 'cadastro-cartoes',
                component: CadastroCartao
            },
            {
                path: 'listagem-cartoes',
                component: ListagemCartoes
            }
        ]
    }
];
