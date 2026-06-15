import { Routes } from '@angular/router';
import { Template } from './template/template';
import { CadastroCartao } from './cartoes/cadastro-cartao/cadastro-cartao';
import { ListagemCartoes } from './cartoes/listagem-cartoes/listagem-cartoes';
import { ListagemCategorias } from './categorias/listagem-categorias/listagem-categorias';
import { CadastroCategoria } from './categorias/cadastro-categoria/cadastro-categoria';
import { CadastroLancamento } from './lancamentos/cadastro-lancamento/cadastro-lancamento';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'paginas/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'paginas',
        component: Template,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'cadastro-cartoes',
                component: CadastroCartao
            },
            {
                path: 'listagem-cartoes',
                component: ListagemCartoes
            },
            {
                path: 'listagem-categorias',
                component : ListagemCategorias
            },
            {
                path: 'cadastro-categorias',
                component: CadastroCategoria
            },
            {
                path: 'cadastro-lancamento',
                component: CadastroLancamento
            }
        ] 
    }
];
