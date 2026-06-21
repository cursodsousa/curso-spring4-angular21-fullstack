import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DetalhesLancamento, TipoLancamento } from '../dados-lancamentos';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../common/components/header/header';
import { LancamentoService } from '../lancamento-service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PageResult } from '../../common/pagination/page-result';
import { DetalhesCategoria } from '../../categorias/dados-categoria';

interface FiltrosForm {
  mes: FormControl<string>;
  tipo: FormControl<TipoLancamento | ''>;
  categoriaId: FormControl<string>;
}

@Component({
  selector: 'app-listagem-lancamentos',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Header],
  templateUrl: './listagem-lancamentos.html',
  styleUrl: './listagem-lancamentos.scss',
})
export class ListagemLancamentos implements OnInit {
  service = inject(LancamentoService);
  toast = inject(ToastrService);

  listagem$!: Observable<PageResult<DetalhesLancamento>>;
  categorias: DetalhesCategoria[] = [];
  paginaAtual = 0;
  tamanhoPagina = 10;

  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup<FiltrosForm>({
      mes: new FormControl<string>('', { nonNullable: true }),
      tipo: new FormControl<TipoLancamento | ''>('', { nonNullable: true }),
      categoriaId: new FormControl<string>('', { nonNullable: true })
    });

    this.listarCategoriasFiltro();
    this.listarLancamentos();
  }

  listarLancamentos() {
    const mes = this.form.get('mes')?.value;
    const tipo = this.form.get('tipo')?.value;
    const categoriaId = this.form.get('categoriaId')?.value;

    this.listagem$ = this.service.listar({
      page: this.paginaAtual,
      size: this.tamanhoPagina,
      mes: mes || undefined,
      tipo: tipo || undefined,
      categoriaId: categoriaId || undefined 
    });
  }

  listarCategoriasFiltro(){
    this.service.listarCategoriasParaFiltrar().subscribe({
      next: (resultado: DetalhesCategoria[]) => {
        this.categorias = resultado;
      },
      error: () => this.toast.error('Erro ao carregar categorias para filtro.')
    });
  }

  aplicarFiltros() {
    this.paginaAtual = 0;
    this.listarLancamentos();
  }

  limparFiltros(){
    this.form.reset();
  }

  deletar(id: string) : void {
    this.service.deletar(id).subscribe({
      next: () => {
        this.toast.success('Lançamento excluído com sucesso!');
        this.listarLancamentos();
      },
      error: () => this.toast.error('Erro ao excluir lançamento.')
    });
  }

  navegar(pagina: number) : void {
    this.paginaAtual = pagina;
    this.listarLancamentos();
  }

  navegarProximo(listagem: PageResult<DetalhesLancamento>) : void {
    if(!listagem.last){
      this.navegar(listagem.number + 1);
    }
  }

  navegarAnterior(listagem: PageResult<DetalhesLancamento>) : void {
    if(!listagem.first){
      this.navegar(listagem.number - 1);
    }
  }

  paginas(totalPages: number) : number[] {
    return Array.from( { length: totalPages }, (_value, index) => index );
  }

  registroInicial(listagem: PageResult<DetalhesLancamento>) : number {
    if(listagem.totalElements === 0){
      return 0;
    }

    return listagem.number * listagem.size + 1;
  }

  registroFinal(listagem: PageResult<DetalhesLancamento>) : number {
    if(listagem.totalElements === 0){
      return 0;
    }

    return Math.min( (listagem.number + 1) * listagem.size, listagem.totalElements );
  }

}
