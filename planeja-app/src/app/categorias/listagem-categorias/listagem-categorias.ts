import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoriaService } from '../categoria-service';
import { PageResult } from '../../common/pagination/page-result';
import { DetalhesCategoria } from '../dados-categoria';

@Component({
  selector: 'app-listagem-categorias',
  imports: [CommonModule, RouterLink],
  templateUrl: './listagem-categorias.html',
  styleUrl: './listagem-categorias.scss',
})
export class ListagemCategorias implements OnInit {

  service = inject(CategoriaService);
  toast = inject(ToastrService);
  listagem$!: Observable<PageResult<DetalhesCategoria>>;
  paginaAtual = 0;
  tamanhoPagina = 5;

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias() {
    this.listagem$ = this.service.listar(this.paginaAtual, this.tamanhoPagina);
  }

  navegar(pagina: number) {
    this.paginaAtual = pagina;
    this.listarCategorias();
  }

  navegarProximo(listagem: PageResult<DetalhesCategoria>) {
    if (!listagem.last) {
      this.navegar(listagem.number + 1);
    }
  }

  navegarAnterior(listagem: PageResult<DetalhesCategoria>) {
    if (!listagem.first) {
      this.navegar(listagem.number - 1);
    }
  }

  paginas(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (valor, index) => index);
  }

  registroInicial(listagem: PageResult<DetalhesCategoria>) {
    if (listagem.totalElements === 0) {
      return 0;
    }

    return (listagem.number * listagem.size) + 1;
  }

  registroFinal(listagem: PageResult<DetalhesCategoria>) {
    if (listagem.totalElements === 0) {
      return 0;
    }

    return Math.min((listagem.number + 1) * listagem.size, listagem.totalElements);
  }

  mudarStatus(idCategoria: string) {
    this.service.mudarStatus(idCategoria)
      .subscribe(() => {
        this.toast.success('Registro atualizado com sucesso!');
        this.listarCategorias();
      });
  }
}
